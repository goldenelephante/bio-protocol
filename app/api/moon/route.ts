import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Fix #6: Strict date validation — only accept YYYY-MM-DD format
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function validateDate(raw: string | null): string {
  if (!raw || !DATE_REGEX.test(raw)) {
    return new Date().toISOString().slice(0, 10);
  }
  // Further check: must be a real calendar date
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return raw;
}

export async function GET(request: Request) {
  // Fix #8: Rate limit moon API calls — 30 per minute per IP
  const ip    = getClientIp(request);
  const limit = rateLimit(`moon:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, {
      status: 429,
      headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
    });
  }

  const { searchParams } = new URL(request.url);
  // Fix #6: Sanitized and validated date
  const date      = validateDate(searchParams.get("date"));
  const timestamp = Math.floor(new Date(date).getTime() / 1000);

  const apiKey = process.env.MOON_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Moon API not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`,
      {
        headers: { "x-api-key": apiKey },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Moon API error" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Fix #2-style: never expose internal error details to client
    return NextResponse.json({ error: "Moon API unavailable" }, { status: 503 });
  }
}
