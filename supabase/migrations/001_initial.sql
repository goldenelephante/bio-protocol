-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
-- pgcrypto for encrypting OAuth tokens at rest
create extension if not exists "pgcrypto";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text check (char_length(full_name) <= 100),
  -- NOTE: email is intentionally NOT stored here — use auth.users.email directly
  -- to avoid sync issues and reduce PII surface area
  bio_type        text check (bio_type in ('Lunar Kapha','Radiant Pitta','Balanced Vata','Adaptive Vata')),
  bio_code        text check (bio_code ~ '^[A-Z]{2}-\d$'),
  menopause_stage text check (menopause_stage in ('Premenopause','Early Perimenopause','Late Perimenopause','Menopause','Post-menopause')),
  wellness_score  integer check (wellness_score between 0 and 100) default 0,
  quiz_completed  boolean default false,
  -- quiz_answers stores health data — marked sensitive, no raw logging
  quiz_answers    jsonb,
  quiz_result     jsonb,
  language        text check (language in ('English','Español','Português','Italiano','Français','Deutsch')) default 'English',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.profiles enable row level security;

-- Fix #10: Granular RLS — split 'for all' into specific operations with proper checks
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No delete policy — users cannot self-delete profiles directly (must go through support / GDPR flow)

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── BIOMARKERS ──────────────────────────────────────────────────────────────
create table public.biomarkers (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null check (char_length(name) <= 100),
  value       numeric not null check (value >= 0 and value <= 100000),
  unit        text not null check (char_length(unit) <= 20),
  status      text check (status in ('low','optimal','elevated','moderate')) not null,
  optimal_min numeric check (optimal_min >= 0),
  optimal_max numeric check (optimal_max >= 0),
  source      text check (source in ('manual','lab','wearable')) default 'manual',
  logged_date date default current_date,
  created_at  timestamptz default now()
);

alter table public.biomarkers enable row level security;

create policy "biomarkers_select_own" on public.biomarkers for select using (auth.uid() = user_id);
create policy "biomarkers_insert_own" on public.biomarkers for insert with check (auth.uid() = user_id);
create policy "biomarkers_update_own" on public.biomarkers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "biomarkers_delete_own" on public.biomarkers for delete using (auth.uid() = user_id);

create index biomarkers_user_date on public.biomarkers(user_id, logged_date desc);

-- ─── HABITS ──────────────────────────────────────────────────────────────────
create table public.habits (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  name       text not null check (char_length(name) >= 1 and char_length(name) <= 80),
  emoji      text default '🌿' check (char_length(emoji) <= 10),
  col        text default '#9DC4B8' check (col ~ '^#[0-9A-Fa-f]{6}$'),
  freq       text default 'Daily' check (char_length(freq) <= 30),
  active     boolean default true,
  created_at timestamptz default now()
);

alter table public.habits enable row level security;

create policy "habits_select_own" on public.habits for select using (auth.uid() = user_id);
create policy "habits_insert_own" on public.habits for insert with check (auth.uid() = user_id);
create policy "habits_update_own" on public.habits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_delete_own" on public.habits for delete using (auth.uid() = user_id);

create index habits_user_id on public.habits(user_id);

-- ─── HABIT LOGS ──────────────────────────────────────────────────────────────
create table public.habit_logs (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  habit_id    uuid references public.habits(id) on delete cascade not null,
  logged_date date not null default current_date check (logged_date <= current_date),
  created_at  timestamptz default now(),
  unique(user_id, habit_id, logged_date)
);

alter table public.habit_logs enable row level security;

create policy "habit_logs_select_own" on public.habit_logs for select using (auth.uid() = user_id);
create policy "habit_logs_insert_own" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "habit_logs_delete_own" on public.habit_logs for delete using (auth.uid() = user_id);
-- No update needed for logs — immutable, delete + reinsert if needed

create index habit_logs_user_date on public.habit_logs(user_id, logged_date desc);

-- ─── SYMPTOM LOGS ────────────────────────────────────────────────────────────
create table public.symptom_logs (
  id               uuid default uuid_generate_v4() primary key,
  user_id          uuid references public.profiles(id) on delete cascade not null,
  logged_date      date not null default current_date check (logged_date <= current_date),
  menopause_stage  integer check (menopause_stage between 0 and 4) default 2,
  hot_flashes      integer check (hot_flashes between 0 and 5) default 0,
  sleep            integer check (sleep between 0 and 5) default 0,
  brain_fog        integer check (brain_fog between 0 and 5) default 0,
  mood             integer check (mood between 0 and 5) default 0,
  fatigue          integer check (fatigue between 0 and 5) default 0,
  notes            text check (char_length(notes) <= 500),
  created_at       timestamptz default now(),
  unique(user_id, logged_date)
);

alter table public.symptom_logs enable row level security;

create policy "symptom_logs_select_own" on public.symptom_logs for select using (auth.uid() = user_id);
create policy "symptom_logs_insert_own" on public.symptom_logs for insert with check (auth.uid() = user_id);
create policy "symptom_logs_update_own" on public.symptom_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "symptom_logs_delete_own" on public.symptom_logs for delete using (auth.uid() = user_id);

create index symptom_logs_user_date on public.symptom_logs(user_id, logged_date desc);

-- ─── WEARABLE CONNECTIONS ────────────────────────────────────────────────────
-- Fix #9: access_token and refresh_token encrypted at rest using pgcrypto
-- They are encrypted with a symmetric key from your ENCRYPTION_KEY env var
-- (set in Supabase Vault or as a database secret — never hardcode here)
create table public.wearable_connections (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references public.profiles(id) on delete cascade not null,
  provider          text not null check (provider in ('oura','whoop','garmin','apple_health','google_fit')),
  terra_user_id     text check (char_length(terra_user_id) <= 200),
  -- Tokens stored encrypted — use get_wearable_token() function to decrypt
  access_token_enc  bytea,
  refresh_token_enc bytea,
  connected_at      timestamptz default now(),
  last_sync         timestamptz,
  active            boolean default true,
  unique(user_id, provider)
);

alter table public.wearable_connections enable row level security;

create policy "wearable_connections_select_own" on public.wearable_connections for select using (auth.uid() = user_id);
create policy "wearable_connections_insert_own" on public.wearable_connections for insert with check (auth.uid() = user_id);
create policy "wearable_connections_update_own" on public.wearable_connections for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wearable_connections_delete_own" on public.wearable_connections for delete using (auth.uid() = user_id);

-- ─── WEARABLE DATA ───────────────────────────────────────────────────────────
create table public.wearable_data (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  provider        text not null check (provider in ('oura','whoop','garmin','apple_health','google_fit')),
  data_date       date not null check (data_date <= current_date + 1),
  hrv_rmssd       numeric check (hrv_rmssd between 0 and 300),
  resting_hr      integer check (resting_hr between 20 and 300),
  spo2            numeric check (spo2 between 50 and 100),
  skin_temp_delta numeric check (skin_temp_delta between -5 and 5),
  sleep_score     integer check (sleep_score between 0 and 100),
  deep_sleep_min  integer check (deep_sleep_min between 0 and 720),
  rem_sleep_min   integer check (rem_sleep_min between 0 and 720),
  steps           integer check (steps between 0 and 100000),
  active_calories integer check (active_calories between 0 and 20000),
  readiness_score integer check (readiness_score between 0 and 100),
  -- Fix #9: raw payload NOT stored — we extract only sanitized fields above
  created_at      timestamptz default now(),
  unique(user_id, provider, data_date)
);

alter table public.wearable_data enable row level security;

create policy "wearable_data_select_own" on public.wearable_data for select using (auth.uid() = user_id);
create policy "wearable_data_insert_own" on public.wearable_data for insert with check (auth.uid() = user_id);
create policy "wearable_data_update_own" on public.wearable_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wearable_data_delete_own" on public.wearable_data for delete using (auth.uid() = user_id);

create index wearable_data_user_date on public.wearable_data(user_id, data_date desc);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
