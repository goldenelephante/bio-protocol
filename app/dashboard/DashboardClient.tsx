"use client";
import Sidebar from "@/components/Sidebar";
import { getPhase } from "@/lib/moon";
import { BIOMARKERS, PROTOCOLS } from "@/lib/data";
import type { User } from "@supabase/supabase-js";

const STATUS_COLORS: Record<string, string[]> = {
  low: ["#C85C30", "rgba(200,92,48,0.1)"],
  elevated: ["#B87830", "rgba(184,120,48,0.1)"],
  optimal: ["#2E8A5E", "rgba(46,138,94,0.1)"],
  moderate: ["#4A6A8A", "rgba(74,106,138,0.1)"],
};

function ScoreRing({ score }: { score: number }) {
  const r = 36, c = 2 * Math.PI * r, dash = (score / 100) * c;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="#7FBDAF" strokeWidth="5"
        strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "44px 44px" }} />
      <text x="44" y="46" textAnchor="middle" fill="#0A0C12" fontSize="16" fontFamily="'DM Mono',monospace">{score}</text>
      <text x="44" y="57" textAnchor="middle" fill="#9BA3AF" fontSize="8" fontFamily="'DM Sans',sans-serif" letterSpacing="1">/100</text>
    </svg>
  );
}

export default function DashboardClient({ user, profile }: { user: User; profile: Record<string, unknown> | null }) {
  const moon = getPhase(new Date());
  const score = profile?.wellness_score ?? 78;
  const bioType = profile?.bio_type ?? "Lunar Kapha";
  const bioCode = profile?.bio_code ?? "LK-7";
  const stage = profile?.menopause_stage ?? "Late Perimenopause";
  const firstName = (profile?.full_name as string | undefined)?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@300;400&display=swap');
    .bp{font-family:'DM Sans',-apple-system,sans-serif;background:#ECEAE5;min-height:100vh;display:flex;color:#0F1117;line-height:1.5}
    .bp-main{flex:1;overflow-y:auto;padding:32px 36px;min-height:100vh}
    .ph{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#0A0C12;letter-spacing:-0.01em;margin-bottom:4px}
    .ps{font-size:11px;color:#777E8A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px}
    .card{background:rgba(255,255,255,0.68);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.85);border-radius:14px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.04)}
    .card-dk{background:#0A0C12;border-radius:14px;padding:20px;color:white}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
    .sb{display:inline-block;padding:2px 8px;border-radius:100px;font-size:9.5px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase}
    .s-low{background:rgba(200,92,48,0.1);color:#C85C30}
    .s-elevated{background:rgba(184,120,48,0.1);color:#B87830}
    .s-optimal{background:rgba(46,138,94,0.1);color:#2E8A5E}
    .s-moderate{background:rgba(74,106,138,0.1);color:#4A6A8A}
    .lbl{font-size:10px;color:#9BA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px}
    .tl-row{display:flex;gap:12px;padding-bottom:18px;position:relative}
    .tl-row:not(:last-child)::after{content:'';position:absolute;left:53px;top:30px;bottom:0;width:1px;background:rgba(0,0,0,0.07)}
    .fin{animation:fin 0.3s ease forwards}
    @keyframes fin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  `;

  return (
    <div className="bp">
      <style>{CSS}</style>
      <Sidebar userName={profile?.full_name ?? user.email ?? "User"} userType={bioType} userCode={bioCode} />
      <main className="bp-main">
        <div className="ph fin">Good morning, {firstName}.</div>
        <div className="ps">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Your protocol is active</div>

        <div className="g2">
          <div className="card-dk">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Bio Type</span>
              <span style={{ fontSize: 10, background: "rgba(127,181,166,0.18)", color: "#9DC4B8", padding: "2px 8px", borderRadius: 100, letterSpacing: "0.1em", textTransform: "uppercase" }}>{bioCode}</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, marginBottom: 8, color: "white" }}>{bioType}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: 16 }}>
              You carry deep vitality reserves with strong lunar rhythm sensitivity. Your biology thrives with consistent routines, hormonal attunement & grounding anti-inflammatory protocols.
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[stage].map(t => (
                <span key={t} style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ flex: 1, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 28 }}>{moon.sym}</div>
              <div style={{ flex: 1 }}>
                <div className="lbl">Moon Phase</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{moon.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>{moon.tip}</div>
              </div>
            </div>
            <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ScoreRing score={score} />
              <div>
                <div className="lbl">Wellness Score</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>Above average for your bracket. Focus: cortisol & estrogen balance.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lbl">Key Biomarkers</div>
        <div className="g3">
          {BIOMARKERS.map(m => (
            <div key={m.name} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{m.name}</div>
                <span className={`sb s-${m.status}`}>{m.status}</span>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 20, fontWeight: 400, color: "#0A0C12", marginBottom: 2 }}>
                {m.value}<span style={{ fontSize: 11, color: "#9BA3AF", marginLeft: 4 }}>{m.unit}</span>
              </div>
              <div style={{ fontSize: 10, color: "#9BA3AF" }}>Optimal: {m.opt}</div>
            </div>
          ))}
        </div>

        <div className="lbl">Today&apos;s Priority Protocol</div>
        <div className="card">
          {PROTOCOLS["Morning Ritual"].map(item => (
            <div key={item.a} className="tl-row">
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: "#9BA3AF", width: 44, paddingTop: 6, textAlign: "right", flexShrink: 0, letterSpacing: "0.04em" }}>{item.t}</div>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, border: "1px solid rgba(0,0,0,0.06)" }}>{item.i}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, color: "#0F1117" }}>{item.a}</div>
                <div style={{ fontSize: 11.5, color: "#6B7280", lineHeight: 1.5 }}>{item.d.split(".")[0]}.</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
