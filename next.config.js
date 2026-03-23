/** @type {import('next').NextConfig} */

const SELF = "'self'";
const NONE = "'none'";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy — don't leak URL to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 2 years, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable dangerous browser features
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      `default-src ${SELF}`,
      // Scripts: self + Next.js inline scripts
      `script-src ${SELF} 'unsafe-inline' 'unsafe-eval'`,
      // Styles: self + Google Fonts
      `style-src ${SELF} 'unsafe-inline' https://fonts.googleapis.com`,
      // Fonts: Google Fonts CDN
      `font-src ${SELF} https://fonts.gstatic.com`,
      // Images: self + data URIs (for SVG)
      `img-src ${SELF} data: blob: https:`,
      // API calls: self + Supabase + Moon API
      `connect-src ${SELF} https://*.supabase.co wss://*.supabase.co https://api.farmsense.net`,
      // No plugins
      `object-src ${NONE}`,
      // No iframes from others
      `frame-ancestors ${NONE}`,
      // Only load from HTTPS
      `upgrade-insecure-requests`,
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Prevent source maps in production (don't expose source to attackers)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
