import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate limiting on auth endpoints ───────────────────────────────────────
  if (pathname.startsWith("/auth/")) {
    const ip    = getClientIp(request);
    const limit = rateLimit(`auth:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!limit.success) {
      return new NextResponse("Too many requests. Please wait a minute.", {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      });
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Enforce secure cookie flags
              httpOnly:  true,
              secure:    process.env.NODE_ENV === "production",
              sameSite:  "lax",
            })
          );
        },
      },
    }
  );

  // IMPORTANT: Use getUser() (server-side JWT validation) never getSession()
  // getSession() only reads from cookie and can be spoofed
  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = [
    "/dashboard",
    "/protocol",
    "/supplements",
    "/habits",
    "/menopause",
    "/profile",
  ];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL ?? request.url);
    // Don't leak the attempted path in the redirect — just send to login
    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from hitting login again
  if (pathname === "/auth/login" && user) {
    const dashUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? request.url);
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
