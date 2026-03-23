import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

interface TerraPayload {
  user: { user_id: string };
  type: string;
  data?: Record<string, unknown>[];
}

// Fix #4: Webhook secret is now REQUIRED — app will refuse to operate without it.
// Fix #5: devId is now properly validated alongside the secret.
function verifyTerraSignature(request: Request): boolean {
  const devId  = request.headers.get("dev-id");
  const secret = request.headers.get("x-api-key");

  const expectedDevId  = process.env.TERRA_DEV_ID;
  const expectedSecret = process.env.TERRA_WEBHOOK_SECRET;

  // If either env var is missing, reject ALL requests — don't silently open the door
  if (!expectedDevId || !expectedSecret) {
    console.warn("[wearable] TERRA_DEV_ID or TERRA_WEBHOOK_SECRET not configured — rejecting request");
    return false;
  }

  return devId === expectedDevId && secret === expectedSecret;
}

// Strict allowlist of valid payload types
const ALLOWED_TYPES = new Set(["activity", "sleep", "body", "daily"]);

// Sanitize numeric values — reject anything that isn't a finite number
function safeNum(val: unknown): number | null {
  if (typeof val !== "number" || !isFinite(val)) return null;
  return val;
}

export async function POST(request: Request) {
  // Fix #8: Rate limit by IP — 60 webhook calls per minute max
  const ip = getClientIp(request);
  const limit = rateLimit(`wearable:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Fix #4 + #5: Both devId AND secret must match — no optional bypass
  if (!verifyTerraSignature(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: TerraPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields exist and are expected types
  if (!payload?.user?.user_id || typeof payload.user.user_id !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Fix: reject unknown payload types
  if (!ALLOWED_TYPES.has(payload.type)) {
    return NextResponse.json({ error: "Unknown payload type" }, { status: 400 });
  }

  const supabase = createClient();

  const { data: conn } = await supabase
    .from("wearable_connections")
    .select("user_id, provider")
    .eq("terra_user_id", payload.user.user_id)
    .single();

  if (!conn) {
    // Don't reveal whether the user exists — return 200 to avoid enumeration
    return NextResponse.json({ success: true });
  }

  const today = new Date().toISOString().slice(0, 10);

  if (payload.type === "activity" && payload.data?.length) {
    const d = payload.data[0] as Record<string, unknown>;
    await supabase.from("wearable_data").upsert({
      user_id:         conn.user_id,
      provider:        conn.provider,
      data_date:       today,
      steps:           safeNum(d.steps),
      active_calories: safeNum(d.active_energy_burned),
      // Fix: Don't store raw payload with potential PII — store only what we use
    }, { onConflict: "user_id,provider,data_date" });
  }

  if (payload.type === "sleep" && payload.data?.length) {
    const d = payload.data[0] as Record<string, unknown>;
    const dur = (d.sleep_durations_data as Record<string, unknown>) ?? {};
    await supabase.from("wearable_data").upsert({
      user_id:        conn.user_id,
      provider:       conn.provider,
      data_date:      today,
      sleep_score:    safeNum(d.sleep_quality_score),
      deep_sleep_min: Math.round(safeNum((dur as Record<string,unknown>).slow_wave_sleep_duration) ?? 0 / 60),
      rem_sleep_min:  Math.round(safeNum((dur as Record<string,unknown>).rem_sleep_duration) ?? 0 / 60),
    }, { onConflict: "user_id,provider,data_date" });
  }

  if (payload.type === "body" && payload.data?.length) {
    const d   = payload.data[0] as Record<string, unknown>;
    const hd  = (d.heart_data as Record<string, unknown>) ?? {};
    const hrv = (hd.hrv_rmssd_data as Record<string, unknown>) ?? {};
    const oxy = (d.oxygen_data as Record<string, unknown>) ?? {};
    const tmp = (d.temperature_data as Record<string, unknown>) ?? {};
    await supabase.from("wearable_data").upsert({
      user_id:          conn.user_id,
      provider:         conn.provider,
      data_date:        today,
      hrv_rmssd:        safeNum(hrv.avg),
      resting_hr:       safeNum(hd.resting_hr_bpm),
      spo2:             safeNum(oxy.avg_saturation_percentage),
      skin_temp_delta:  safeNum(tmp.body_temp_delta),
    }, { onConflict: "user_id,provider,data_date" });
  }

  return NextResponse.json({ success: true });
}
