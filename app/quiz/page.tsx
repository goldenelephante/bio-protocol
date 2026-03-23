"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, ALL_QUESTIONS } from "@/lib/data";
import { scoreAnswers, type QuizAnswers } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/client";

// ─── STYLES ──────────────────────────────────────────────────────────────────

const CSS = `
  .qw{font-family:'DM Sans',-apple-system,sans-serif;background:#09090F;min-height:100vh;color:#fff;display:flex;flex-direction:column;position:relative;overflow-x:hidden}
  .qw::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(127,189,175,0.12) 0%,transparent 70%);pointer-events:none;z-index:0}
  .q-hd{padding:18px 32px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:10;border-bottom:1px solid rgba(255,255,255,0.05)}
  .q-logo{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;letter-spacing:0.02em;color:white;cursor:pointer;text-decoration:none}
  .q-logo span{color:#7FBDAF}
  .q-prog-wrap{flex:1;max-width:320px;margin:0 32px}
  .q-prog-bar{height:2px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-bottom:5px}
  .q-prog-fill{height:100%;background:linear-gradient(90deg,#7FBDAF,#8C7BA8);border-radius:2px;transition:width 0.5s ease}
  .q-prog-lbl{font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.1em;text-transform:uppercase;text-align:right}
  .q-skip{font-size:11px;color:rgba(255,255,255,0.2);cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s;background:none;border:none}
  .q-skip:hover{color:rgba(255,255,255,0.5)}
  .q-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;position:relative;z-index:5}
  .q-card{width:100%;max-width:580px}
  .q-sec-tag{display:inline-flex;align-items:center;gap:7px;padding:4px 12px;border-radius:100px;border:1px solid;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:20px}
  .q-num{font-family:'DM Mono',monospace;font-size:11px;color:rgba(255,255,255,0.22);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px}
  .q-text{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;line-height:1.35;margin-bottom:28px;letter-spacing:-0.01em}
  .q-opts{display:flex;flex-direction:column;gap:8px}
  .q-opt{padding:13px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);cursor:pointer;font-size:13px;color:rgba(255,255,255,0.65);transition:all 0.18s;background:rgba(255,255,255,0.03);display:flex;align-items:center;gap:10px}
  .q-opt:hover{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.9)}
  .q-opt.sel{color:#fff}
  .q-opt-chk{width:16px;height:16px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;transition:all 0.15s}
  .q-scale{padding:8px 0}
  .q-scale-track{height:3px;background:rgba(255,255,255,0.1);border-radius:3px;position:relative;margin:16px 0 8px;cursor:pointer}
  .q-scale-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#7FBDAF,#8C7BA8);border-radius:3px;transition:width 0.2s}
  .q-scale-thumb{position:absolute;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:#7FBDAF;border:3px solid #09090F;box-shadow:0 0 0 1px #7FBDAF;transition:left 0.2s}
  .q-scale-lbls{display:flex;justify-content:space-between;font-size:10.5px;color:rgba(255,255,255,0.3);margin-top:4px}
  .q-scale-val{text-align:center;font-family:'DM Mono',monospace;font-size:22px;color:#7FBDAF;margin-top:8px}
  .q-hint{font-size:10px;color:rgba(255,255,255,0.2);text-align:center;margin-top:4px}
  .q-multi-hint{font-size:10.5px;color:rgba(255,255,255,0.22);margin-bottom:10px;letter-spacing:0.04em}
  .q-nav{display:flex;align-items:center;justify-content:space-between;margin-top:28px}
  .q-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 22px;border-radius:9px;font-size:12.5px;font-weight:500;cursor:pointer;transition:all 0.18s;border:none;font-family:'DM Sans',sans-serif;letter-spacing:0.02em}
  .q-btn-p{background:#7FBDAF;color:#05120F}
  .q-btn-p:hover{background:#91C9BC;transform:translateY(-1px)}
  .q-btn-p:disabled{background:rgba(127,189,175,0.25);color:rgba(127,189,175,0.4);cursor:not-allowed;transform:none}
  .q-btn-g{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.45);border:1px solid rgba(255,255,255,0.08)}
  .q-btn-g:hover{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7)}
  .q-btn-g:disabled{opacity:0.4;cursor:not-allowed}
  .lnd{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 24px;position:relative;z-index:5;max-width:640px;margin:0 auto}
  .lnd-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 14px;border-radius:100px;background:rgba(127,189,175,0.1);border:1px solid rgba(127,189,175,0.2);font-size:10.5px;color:#9DC4B8;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px}
  .lnd-h{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,6vw,58px);font-weight:300;line-height:1.12;margin-bottom:18px;letter-spacing:-0.02em}
  .lnd-h em{font-style:italic;color:#9DC4B8}
  .lnd-sub{font-size:14px;color:rgba(255,255,255,0.42);line-height:1.75;max-width:440px;margin:0 auto 36px}
  .lnd-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:36px}
  .lnd-pill{padding:6px 14px;border-radius:100px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(255,255,255,0.4)}
  .lnd-cta{padding:14px 32px;border-radius:11px;background:#7FBDAF;color:#05120F;font-size:14px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;letter-spacing:0.02em;transition:all 0.2s}
  .lnd-cta:hover{background:#91C9BC;transform:translateY(-2px);box-shadow:0 12px 40px rgba(127,189,175,0.2)}
  .lnd-disclaimer{font-size:10px;color:rgba(255,255,255,0.18);margin-top:14px;line-height:1.5}
  .sec-trans{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 24px;position:relative;z-index:5}
  .sec-ic{font-size:42px;margin-bottom:18px;opacity:0.85}
  .sec-h{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;margin-bottom:10px;letter-spacing:-0.01em}
  .sec-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:32px;line-height:1.6;max-width:360px}
  .sec-dots{display:flex;gap:6px;margin-bottom:32px}
  .sec-dot{height:3px;border-radius:2px;transition:all 0.3s}
  .email-card{width:100%;max-width:480px;margin:0 auto;padding:24px}
  .email-h{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;margin-bottom:8px;line-height:1.3;text-align:center}
  .email-sub{font-size:12.5px;color:rgba(255,255,255,0.35);text-align:center;line-height:1.65;margin-bottom:28px}
  .email-inp{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:14px 18px;font-size:14px;font-family:'DM Sans',sans-serif;color:white;outline:none;transition:border 0.2s;margin-bottom:10px}
  .email-inp:focus{border-color:rgba(127,189,175,0.5)}
  .email-inp::placeholder{color:rgba(255,255,255,0.2)}
  .email-cta{width:100%;padding:14px;border-radius:10px;background:#7FBDAF;color:#05120F;font-size:13.5px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;margin-bottom:12px;transition:all 0.2s;letter-spacing:0.02em}
  .email-cta:hover:not(:disabled){background:#91C9BC}
  .email-cta:disabled{opacity:0.6;cursor:not-allowed}
  .email-disc{font-size:10px;color:rgba(255,255,255,0.18);text-align:center;line-height:1.6}
  .res-w{flex:1;padding:32px 24px;position:relative;z-index:5;display:flex;flex-direction:column;align-items:center}
  .res-card{width:100%;max-width:620px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:18px;padding:32px;margin-bottom:16px}
  .res-top{display:flex;align-items:center;gap:24px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.07)}
  .res-type{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin-bottom:6px;line-height:1.2}
  .res-tag{font-size:10px;color:rgba(255,255,255,0.28);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px}
  .res-desc{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7}
  .res-prio-h{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:14px}
  .res-prio{display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
  .res-prio-item{display:flex;align-items:flex-start;gap:12px;padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px}
  .res-prio-ic{width:30px;height:30px;border-radius:8px;background:rgba(127,189,175,0.1);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
  .res-locked{text-align:center;padding:20px;background:rgba(140,123,168,0.08);border:1px solid rgba(140,123,168,0.18);border-radius:12px;margin-bottom:16px;width:100%;max-width:620px}
  .res-btn-p{width:100%;padding:14px;border-radius:10px;background:#7FBDAF;color:#05120F;font-size:13.5px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;margin-bottom:8px;transition:all 0.2s;letter-spacing:0.02em}
  .res-btn-p:hover{background:#91C9BC}
  .res-btn-s{width:100%;padding:12px;border-radius:10px;background:transparent;color:rgba(255,255,255,0.35);font-size:12px;cursor:pointer;border:1px solid rgba(255,255,255,0.08);font-family:'DM Sans',sans-serif;transition:all 0.2s}
  @keyframes qin{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .qin{animation:qin 0.35s ease forwards}
`;

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 88 }: { score: number; size?: number }) {
  const r = (size / 2) - 7, c = 2 * Math.PI * r, dash = (score / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7FBDAF" strokeWidth="5"
        strokeDasharray={`${dash} ${c-dash}`} strokeLinecap="round"
        style={{transform:`rotate(-90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}/>
      <text x={size/2} y={size/2+5} textAnchor="middle" fill="white" fontSize="16" fontFamily="'DM Mono',monospace" fontWeight="300">{score}</text>
      <text x={size/2} y={size/2+16} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="'DM Sans',sans-serif" letterSpacing="1">/100</text>
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
type Screen = "landing" | "section" | "quiz" | "email" | "results";

export default function QuizPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("landing");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<ReturnType<typeof scoreAnswers> | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const curSection = SECTIONS[sectionIdx];
  const curQ = curSection?.questions[qIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = answeredCount / ALL_QUESTIONS.length;
  const globalQNum = ALL_QUESTIONS.findIndex(q => q.id === curQ?.id) + 1;

  const canAdvance = () => {
    if (!curQ) return false;
    const a = answers[curQ.id];
    if (curQ.type === "scale") return typeof a === "number";
    if (curQ.type === "multi") return Array.isArray(a) && a.length > 0;
    return !!a;
  };

  const goNext = () => {
    if (qIdx + 1 < curSection.questions.length) {
      setQIdx(qIdx + 1);
    } else if (sectionIdx + 1 < SECTIONS.length) {
      setSectionIdx(sectionIdx + 1);
      setQIdx(0);
      setScreen("section");
    } else {
      setResult(scoreAnswers(answers));
      setScreen("email");
    }
  };

  const goPrev = () => {
    if (qIdx > 0) { setQIdx(qIdx - 1); }
    else if (sectionIdx > 0) {
      const prev = SECTIONS[sectionIdx - 1];
      setSectionIdx(sectionIdx - 1);
      setQIdx(prev.questions.length - 1);
      setScreen("quiz");
    }
  };

  const handleScaleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setAnswers(a => ({ ...a, [curQ!.id]: Math.round(x * 5) }));
  };

  const handleSubmit = async () => {
    if (!email.includes("@") || loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Generate PDF report and send via email
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? "Report generation failed");
      }

      // 2. Send magic link for platform access
      const supabase = createClient();
      await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // 3. Cache result for results page (sessionStorage only)
      sessionStorage.setItem("bp_quiz_answers", JSON.stringify(answers));
      sessionStorage.setItem("bp_quiz_result", JSON.stringify(result));
      sessionStorage.setItem("bp_user_name", name);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
      setLoading(false);
      return;
    }

    setLoading(false);
    setScreen("results");
  };

  const sec = curSection;

  if (screen === "landing") return (
    <div className="qw">
      <style>{CSS}</style>
      <div className="q-hd">
        <span className="q-logo">bio<span>.protocol</span></span>
      </div>
      <div className="lnd qin">
        <div className="lnd-badge">✦ Precision Anti-Aging Protocol</div>
        <h1 className="lnd-h">Discover your<br/><em>biological blueprint</em><br/>for longevity</h1>
        <p className="lnd-sub">50 questions. 8 minutes. A fully personalized anti-aging protocol delivered to your inbox — based on your unique biology, hormonal stage & lifestyle signals.</p>
        <div className="lnd-pills">
          {["Bio Type Analysis","Hormonal Mapping","Custom Protocol","Supplement Stack","Cellular Age Score","Moon Cycle Sync"].map(p => (
            <span key={p} className="lnd-pill">{p}</span>
          ))}
        </div>
        <button className="lnd-cta" onClick={() => { setSectionIdx(0); setScreen("section"); }}>Begin your assessment →</button>
        <p className="lnd-disclaimer">Free · No credit card · Takes ~8 minutes<br/>Your data is private and never sold.</p>
      </div>
    </div>
  );

  if (screen === "section") return (
    <div className="qw">
      <style>{CSS}</style>
      <div className="q-hd">
        <span className="q-logo">bio<span>.protocol</span></span>
      </div>
      <div className="sec-trans qin">
        <div className="sec-ic" style={{color:sec.color}}>{sec.icon}</div>
        <h2 className="sec-h">{sec.title}</h2>
        <p className="sec-sub">{sec.subtitle}</p>
        <div className="sec-dots">
          {SECTIONS.map(s => (
            <div key={s.id} className="sec-dot"
              style={{background: s.id===sec.id ? sec.color : "rgba(255,255,255,0.12)", width: s.id===sec.id ? 20 : 8}}/>
          ))}
        </div>
        <button className="q-btn q-btn-p" onClick={() => setScreen("quiz")}>
          {sectionIdx === 0 ? "Start here" : "Continue"} →
        </button>
      </div>
    </div>
  );

  if (screen === "quiz" && curQ) return (
    <div className="qw">
      <style>{CSS}</style>
      <div className="q-hd">
        <span className="q-logo">bio<span>.protocol</span></span>
        <div className="q-prog-wrap">
          <div className="q-prog-bar"><div className="q-prog-fill" style={{width:`${progress*100}%`}}/></div>
          <div className="q-prog-lbl">{answeredCount} of {ALL_QUESTIONS.length} answered</div>
        </div>
        <button className="q-skip" onClick={() => { setResult(scoreAnswers(answers)); setScreen("email"); }}>Skip to results</button>
      </div>
      <div className="q-body">
        <div className="q-card qin" key={curQ.id}>
          <div className="q-sec-tag" style={{borderColor:sec.color+"40",color:sec.color}}>
            <span>{sec.icon}</span>{sec.title}
          </div>
          <div className="q-num">Question {globalQNum} of {ALL_QUESTIONS.length}</div>
          <div className="q-text">{curQ.text}</div>

          {curQ.type === "scale" && (
            <div className="q-scale">
              <div className="q-scale-track" onClick={handleScaleClick}>
                <div className="q-scale-fill" style={{width:`${((typeof answers[curQ.id]==="number"?(answers[curQ.id] as number):3)/5)*100}%`}}/>
                <div className="q-scale-thumb" style={{left:`${((typeof answers[curQ.id]==="number"?(answers[curQ.id] as number):3)/5)*100}%`}}/>
              </div>
              <div className="q-scale-lbls"><span>{curQ.min}</span><span>{curQ.max}</span></div>
              <div className="q-scale-val">{typeof answers[curQ.id]==="number"?(answers[curQ.id] as number):3}</div>
              <div className="q-hint">Tap or drag the bar</div>
            </div>
          )}

          {(curQ.type === "single" || curQ.type === "multi") && (
            <>
              {curQ.type === "multi" && <div className="q-multi-hint">Select all that apply</div>}
              <div className="q-opts">
                {curQ.opts?.map(opt => {
                  const ans = answers[curQ.id];
                  const sel = curQ.type === "multi"
                    ? (Array.isArray(ans) && ans.includes(opt))
                    : ans === opt;
                  const onClick = () => {
                    if (curQ.type === "multi") {
                      const cur = Array.isArray(ans) ? ans : [];
                      setAnswers(a => ({...a, [curQ.id]: sel ? cur.filter(x=>x!==opt) : [...cur,opt]}));
                    } else {
                      setAnswers(a => ({...a, [curQ.id]: opt}));
                    }
                  };
                  return (
                    <div key={opt} className={`q-opt${sel?" sel":""}`}
                      style={sel?{borderColor:sec.color+"60",background:sec.color+"18"}:{}}
                      onClick={onClick}>
                      <div className="q-opt-chk" style={sel?{background:sec.color,borderColor:sec.color}:{}}>
                        {sel && "✓"}
                      </div>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <div className="q-card q-nav">
          <button className="q-btn q-btn-g" onClick={goPrev} disabled={sectionIdx===0&&qIdx===0}>← Back</button>
          <span style={{fontSize:10.5,color:"rgba(255,255,255,0.2)",letterSpacing:"0.08em",textTransform:"uppercase"}}>
            {sectionIdx+1} / {SECTIONS.length}
          </span>
          <button className="q-btn q-btn-p" onClick={goNext} disabled={!canAdvance()}>
            {sectionIdx===SECTIONS.length-1&&qIdx===curSection.questions.length-1 ? "See results →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === "email" && result) return (
    <div className="qw">
      <style>{CSS}</style>
      <div className="q-hd">
        <span className="q-logo">bio<span>.protocol</span></span>
      </div>
      <div className="q-body">
        <div className="email-card qin">
          <div style={{textAlign:"center",marginBottom:20}}><ScoreRing score={result.score} size={80}/></div>
          <h2 className="email-h">Your protocol is<br/>ready.</h2>
          <p className="email-sub">Enter your details to receive your personalized bio.protocol report. Your biological blueprint, prioritized interventions & full supplement stack — delivered instantly.</p>
          <input className="email-inp" placeholder="Your first name" value={name} onChange={e=>setName(e.target.value)}/>
          <input className="email-inp" type="email" placeholder="Your email address" value={email}
            onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          <button className="email-cta" onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending your report..." : "Send my free protocol →"}
          </button>
          {errorMsg && (
            <div style={{background:"rgba(200,92,48,0.1)",border:"1px solid rgba(200,92,48,0.3)",borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#E0806A"}}>
              {errorMsg}
            </div>
          )}
          <p className="email-disc">Your report will arrive within minutes. We never spam or sell data.<br/>After your report you&apos;ll be invited to access the full bio.protocol platform.</p>
        </div>
      </div>
    </div>
  );

  if (screen === "results" && result) {
    const locked = ["Human Type Deep Dive","Full Biomarker Protocol","Moon Cycle Calendar","Personalized Supplement Stack","Menopause Stage Map","60-Day Anti-Aging Roadmap"];
    return (
      <div className="qw">
        <style>{CSS}</style>
        <div className="q-hd">
          <span className="q-logo">bio<span>.protocol</span></span>
        </div>
        <div className="res-w qin">
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Your Bio Report</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300}}>{name ? `${name}'s` : "Your"} bio.protocol Report</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>Free Preview · Check your email for the full version</div>
          </div>
          <div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"16px 0",width:"100%",maxWidth:620}}/>
          <div className="res-card">
            <div className="res-top">
              <ScoreRing score={result.score} size={96}/>
              <div style={{flex:1}}>
                <div className="res-tag">Bio Human Type</div>
                <div className="res-type">{result.type}</div>
                <div className="res-desc">{result.typeDesc}</div>
              </div>
            </div>
            <div className="res-prio-h">Top 3 Priority Interventions</div>
            <div className="res-prio">
              {result.priorities.map((p,i) => (
                <div key={i} className="res-prio-item">
                  <div className="res-prio-ic">{p.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{p.title}</div>
                    <div style={{fontSize:11.5,color:"rgba(255,255,255,0.38)",lineHeight:1.55}}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"14px 16px",background:"rgba(127,189,175,0.07)",border:"1px solid rgba(127,189,175,0.15)",borderRadius:10}}>
              <div style={{fontSize:11,color:"#7FBDAF",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Unlocked in full platform</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {locked.map(l => (
                  <span key={l} style={{fontSize:10.5,color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.05)",padding:"3px 9px",borderRadius:4}}>🔒 {l}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="res-locked">
            <div style={{fontSize:24,marginBottom:8,opacity:0.5}}>⬡</div>
            <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>Access your complete bio.protocol</div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.6,marginBottom:16,maxWidth:380,margin:"0 auto 16px"}}>
              Your full report has been sent to your email. Upgrade to bio.protocol Premium to unlock your complete personalized platform.
            </p>
            <button className="res-btn-p" onClick={() => router.push("/auth/login")}>Unlock bio.protocol Premium →</button>
            <button className="res-btn-s">Check your email for the free report</button>
          </div>
          <div style={{height:48}}/>
        </div>
      </div>
    );
  }

  return null;
}
