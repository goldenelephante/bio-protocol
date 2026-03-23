# bio.protocol

Premium anti-aging web platform — personalized longevity protocols powered by your unique biology.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### 1. Clone & install
```bash
git clone https://github.com/your-username/bio-protocol.git
cd bio-protocol
npm install
```

### 2. Environment variables
```bash
cp .env.local.example .env.local
```
Fill in your values — Supabase URL and anon key are already set. Add your Moon API key.

### 3. Database setup
Run the migration in your Supabase SQL editor:
```
supabase/migrations/001_initial.sql
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure
```
bio-protocol/
├── app/                    # Next.js App Router pages
│   ├── quiz/               # Lead magnet questionnaire (pre-auth)
│   ├── dashboard/          # Main dashboard (protected)
│   ├── protocol/           # Personalized protocol tabs
│   ├── supplements/        # Supplement recommendations
│   ├── habits/             # Habit tracker + moon calendar
│   ├── menopause/          # Menopause stage tracker
│   ├── profile/            # User profile & settings
│   └── auth/               # Supabase auth flow
├── components/             # Reusable React components
├── lib/                    # Utilities: Supabase, moon calc, scoring
└── supabase/               # Database migrations
```

## Features
- **50-question lead magnet quiz** → personalized PDF bio report via email
- **Bio Protocol Dashboard** — bio type, biomarkers, wellness score
- **Personalized Protocol** — morning ritual, nutrition, movement, sleep, skin tabs
- **Supplement Recommendations** — adaptogens, plant intelligence, cellular longevity, hormonal harmony
- **Habit Tracker** — add/edit/remove with monthly moon calendar overlay
- **Menopause Tracker** — stage map, daily symptom logging, moon sync
- **Profile** — report download, language selector, biomarker manual entry
