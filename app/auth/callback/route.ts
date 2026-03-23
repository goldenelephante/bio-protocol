import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Allowlist of paths we can safely redirect to after auth.
// This prevents open-redirect attacks where an attacker manipulates
// the callback URL to redirect users to a malicious site.
const ALLOWED_REDIRECT_PATHS = ["/dashboard", "/quiz", "/profile"];

function safeRedirectUrl(base: string, path: string): string {
  // Only allow paths from our allowlist — never use user-supplied origin
  const allowed = ALLOWED_REDIRECT_PATHS.includes(path) ? path : "/dashboard";
  return `${base}${allowed}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard";

  // Use the server's own origin, never trust the client-supplied origin
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(safeRedirectUrl(appUrl, next));
    }
  }

  return NextResponse.redirect(`${appUrl}/auth/login?error=auth_failed`);
}
