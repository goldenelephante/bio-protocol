import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { scoreAnswers, type QuizAnswers } from "@/lib/scoring";
import { buildReportData } from "@/lib/reportData";
import { generateReportPdf } from "@/lib/generatePdf";
import { sendReportEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

// This route runs in Node.js runtime (not Edge) because @react-pdf/renderer
// requires Node APIs (Buffer, etc.)
export const runtime = "nodejs";

// Input validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_MAX    = 100;
const NAME_REGEX  = /^[a-zA-ZÀ-ÖØ-öø-ÿ'\- ]+$/; // Letters (incl. accented), apostrophe, hyphen, space

interface ReportRequest {
  name: string;
  email: string;
  answers: QuizAnswers;
}

function validateInput(body: unknown): { data: ReportRequest } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  const name  = typeof b.name  === "string" ? b.name.trim()  : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";

  if (!name || name.length > NAME_MAX)          return { error: "Invalid name" };
  if (!NAME_REGEX.test(name))                   return { error: "Name contains invalid characters" };
  if (!email || !EMAIL_REGEX.test(email))       return { error: "Invalid email address" };
  if (typeof b.answers !== "object" || !b.answers) return { error: "Missing quiz answers" };

  // Sanitize answers — only allow string, string[], or number values
  const rawAnswers = b.answers as Record<string, unknown>;
  const answers: QuizAnswers = {};
  for (const [k, v] of Object.entries(rawAnswers)) {
    if (!k.match(/^q\d{1,2}$/)) continue; // only q1–q50
    if (typeof v === "string" || typeof v === "number") {
      answers[k] = v;
    } else if (Array.isArray(v) && v.every(x => typeof x === "string")) {
      answers[k] = v;
    }
  }

  return { data: { name, email, answers } };
}

export async function POST(request: Request) {
  // Rate limit: 3 reports per IP per hour (PDF generation is expensive)
  const ip    = getClientIp(request);
  const limit = rateLimit(`report:${ip}`, { limit: 3, windowMs: 60 * 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many report requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateInput(body);
  if ("error" in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { name, email, answers } = validation.data;

  try {
    // 1. Score the answers
    const score      = scoreAnswers(answers);
    const reportData = buildReportData(name, email, answers, score);

    // 2. Generate PDF
    const pdfBuffer = await generateReportPdf(reportData);

    // 3. Send email with PDF attachment
    await sendReportEmail(email, name, pdfBuffer, score.score, score.type);

    // 4. Persist to Supabase (create/update user profile with quiz results)
    //    We do this async — don't block the response on it
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("profiles").upsert({
        id:             user.id,
        full_name:      name,
        bio_type:       score.type,
        bio_code:       score.typeCode,
        wellness_score: score.score,
        quiz_completed: true,
        quiz_answers:   answers,
        quiz_result:    {
          score:       score.score,
          type:        score.type,
          typeCode:    score.typeCode,
          priorities:  score.priorities,
          isMenopause: score.isMenopause,
        },
      }, { onConflict: "id" });
    }

    return NextResponse.json({ success: true, score: score.score, type: score.type });

  } catch (err) {
    // Log server-side only — never expose internal errors to the client
    console.error("[report] generation error:", err);
    return NextResponse.json(
      { error: "Report generation failed. Please try again." },
      { status: 500 }
    );
  }
}
