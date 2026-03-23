import Link from "next/link";

export const metadata = {
  title: "bio.protocol — Personalized Anti-Aging Platform",
  description:
    "Discover your biological blueprint. 50 questions. A fully personalized anti-aging protocol — based on your unique biology, hormonal stage & lifestyle signals.",
};

const TESTIMONIALS = [
  {
    quote: "I finally understand why the same protocols don't work for everyone. My Lunar Kapha report completely changed how I approach my mornings.",
    name: "Isabelle M.",
    tag: "Late Perimenopause · Age 48",
    score: 81,
    type: "Lunar Kapha",
  },
  {
    quote: "The supplement stack alone was worth it. I had been taking the wrong things for years. My HRV has gone up 18 points in 10 weeks.",
    name: "Sara L.",
    tag: "Radiant Pitta · Age 39",
    score: 74,
    type: "Radiant Pitta",
  },
  {
    quote: "The moon cycle overlay on the habit tracker sounds woo but the science is real. My recovery windows have shifted completely.",
    name: "Valentina R.",
    tag: "Balanced Vata · Age 44",
    score: 69,
    type: "Balanced Vata",
  },
];

const FEATURES = [
  { icon: "⬡", title: "Bio Human Type", desc: "Four biological archetypes mapped to your metabolic, hormonal, and nervous system patterns. The foundation of your entire protocol.", col: "#7FBDAF", bg: "rgba(127,189,175,0.08)" },
  { icon: "◈", title: "Biomarker Dashboard", desc: "Track cortisol, estradiol, NAD+, hs-CRP and more against personalized optimal ranges. Connect wearables for continuous HRV and sleep data.", col: "#7B6FA8", bg: "rgba(123,111,168,0.08)" },
  { icon: "≡", title: "Custom Protocol", desc: "A precision daily protocol: morning ritual sequence, nutrition timing windows, movement prescription, sleep architecture, and skin longevity stack.", col: "#C4965A", bg: "rgba(196,150,90,0.08)" },
  { icon: "◐", title: "Supplement Intelligence", desc: "Adaptogens, cellular longevity compounds, hormonal harmony formulas and plant intelligence — selected and dosed for your specific bio type.", col: "#C47FA0", bg: "rgba(196,127,160,0.08)" },
  { icon: "▦", title: "Habit + Moon Calendar", desc: "Log daily practices on a full calendar with lunar cycle overlays. New moon for cellular reset. Full moon for peak physical activation.", col: "#8FAA6B", bg: "rgba(143,170,107,0.08)" },
  { icon: "◎", title: "Menopause Stage Tracker", desc: "Map your hormonal stage across 5 phases. Track symptoms with precision sliders, sync practices with the lunar cycle, and receive stage-specific protocols.", col: "#C47FA0", bg: "rgba(196,127,160,0.08)" },
];

const FAQS = [
  { q: "Is the bio assessment really free?", a: "Yes — completely. 50 questions, 8 minutes, your personalized PDF report delivered to your inbox at no cost. The premium platform is a separate subscription." },
  { q: "How is my bio type determined?", a: "Through a weighted scoring engine across 8 domains: foundation, sleep, energy, hormonal landscape, stress, nutrition, movement, and longevity mindset. Each answer contributes to your archetype classification." },
  { q: "Is my health data private?", a: "Completely. Your data is encrypted at rest in a Supabase database with row-level security — only you can access it. We never sell, share, or use your data for advertising." },
  { q: "What if I'm not in perimenopause?", a: "bio.protocol is built for everyone. The menopause tracker is an additional feature. The core protocol, supplement stack, and biomarker dashboard apply to all bio types regardless of hormonal status." },
  { q: "How often should I redo the assessment?", a: "Every 90 days. Biology shifts — especially during hormonal transitions. Your score and priority interventions will update to reflect your current state." },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@300;400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#09090F}
  .serif{font-family:'Cormorant Garamond',serif}
  .mono{font-family:'DM Mono',monospace}
  a{text-decoration:none;color:inherit}

  /* ── Animations ─────────────────────────────────────────────────────── */
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes floatA{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-12px) rotate(1deg)}}
  @keyframes floatB{0%,100%{transform:translateY(-8px) rotate(-1deg)}50%{transform:translateY(6px) rotate(0.5deg)}}
  @keyframes pulseGlow{0%,100%{opacity:0.5}50%{opacity:1}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes orb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}

  .fu{animation:fadeUp 0.75s ease forwards;opacity:0}
  .fi{animation:fadeIn 1s ease forwards;opacity:0}
  .d1{animation-delay:0.05s} .d2{animation-delay:0.15s} .d3{animation-delay:0.28s}
  .d4{animation-delay:0.42s} .d5{animation-delay:0.58s}

  /* ── Nav ─────────────────────────────────────────────────────────────── */
  .nav{position:fixed;top:0;left:0;right:0;z-index:50;border-bottom:1px solid rgba(255,255,255,0.06);
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(9,9,15,0.78)}
  .nav-inner{max-width:1140px;margin:0 auto;padding:16px 32px;
    display:flex;align-items:center;justify-content:space-between}
  .nav-link{font-size:13px;color:rgba(255,255,255,0.38);transition:color 0.2s;letter-spacing:0.01em}
  .nav-link:hover{color:rgba(255,255,255,0.75)}
  .nav-cta{padding:8px 20px;border-radius:8px;background:#7FBDAF;color:#05120F;
    font-size:13px;font-weight:500;letter-spacing:0.02em;transition:all 0.2s}
  .nav-cta:hover{background:#91C9BC;transform:translateY(-1px)}

  /* ── Hero ────────────────────────────────────────────────────────────── */
  .hero{position:relative;min-height:100vh;display:flex;align-items:center;
    justify-content:center;text-align:center;padding:120px 24px 80px;overflow:hidden}
  .hero-glow-1{position:absolute;top:-20%;left:50%;transform:translateX(-50%);
    width:900px;height:600px;
    background:radial-gradient(ellipse,rgba(127,189,175,0.13) 0%,transparent 65%);
    pointer-events:none;animation:orb 18s ease-in-out infinite}
  .hero-glow-2{position:absolute;bottom:0;right:-10%;
    width:500px;height:500px;
    background:radial-gradient(circle,rgba(123,111,168,0.1) 0%,transparent 70%);
    pointer-events:none;animation:orb 24s ease-in-out infinite reverse}
  .hero-glow-3{position:absolute;bottom:10%;left:-5%;
    width:400px;height:400px;
    background:radial-gradient(circle,rgba(196,150,90,0.07) 0%,transparent 70%);
    pointer-events:none;animation:orb 20s ease-in-out infinite 4s}

  /* Floating cards in hero */
  .hero-card{position:absolute;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    background:rgba(15,17,26,0.72);border:1px solid rgba(255,255,255,0.09);
    border-radius:12px;padding:14px 18px;pointer-events:none}
  .hero-card-a{top:22%;left:4%;animation:floatA 7s ease-in-out infinite}
  .hero-card-b{top:18%;right:5%;animation:floatB 9s ease-in-out infinite 1s}
  .hero-card-c{bottom:22%;left:6%;animation:floatA 11s ease-in-out infinite 2s}
  .hero-card-d{bottom:20%;right:4%;animation:floatB 8s ease-in-out infinite 3s}

  /* ── Glass card style ────────────────────────────────────────────────── */
  .glass{background:rgba(255,255,255,0.035);
    border:1px solid rgba(255,255,255,0.07);border-radius:14px}
  .glass-strong{background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1);border-radius:14px}

  /* ── Shimmer badge ───────────────────────────────────────────────────── */
  .shimmer-badge{
    background:linear-gradient(90deg,rgba(127,189,175,0.08),rgba(127,189,175,0.18),rgba(127,189,175,0.08));
    background-size:200% auto;animation:shimmer 4s linear infinite;
    border:1px solid rgba(127,189,175,0.22);border-radius:100px;
    padding:6px 16px;display:inline-flex;align-items:center;gap:8px;
    font-size:10.5px;color:#9DC4B8;letter-spacing:0.12em;text-transform:uppercase}

  /* ── CTA button ──────────────────────────────────────────────────────── */
  .cta-primary{display:inline-flex;align-items:center;gap:8px;
    padding:15px 34px;border-radius:11px;background:#7FBDAF;color:#05120F;
    font-size:15px;font-weight:500;letter-spacing:0.02em;transition:all 0.22s;
    font-family:'DM Sans',sans-serif}
  .cta-primary:hover{background:#91C9BC;transform:translateY(-2px);
    box-shadow:0 16px 48px rgba(127,189,175,0.2)}
  .cta-ghost{display:inline-flex;align-items:center;gap:8px;
    padding:14px 24px;border-radius:11px;border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.5);font-size:14px;transition:all 0.2s;
    background:rgba(255,255,255,0.04)}
  .cta-ghost:hover{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.78);
    border-color:rgba(255,255,255,0.2)}

  /* ── Section head ────────────────────────────────────────────────────── */
  .sec-eyebrow{font-size:10px;color:rgba(255,255,255,0.22);
    letter-spacing:0.22em;text-transform:uppercase;margin-bottom:14px}
  .sec-h{font-size:clamp(30px,4vw,44px);font-weight:300;line-height:1.2;
    font-family:'Cormorant Garamond',serif}
  .sec-em{color:#9DC4B8;font-style:italic}

  /* ── Feature cards ───────────────────────────────────────────────────── */
  .feat-card{padding:28px;border-radius:14px;transition:all 0.22s;cursor:default}
  .feat-card:hover{background:rgba(255,255,255,0.055);transform:translateY(-3px)}

  /* ── Testimonials ────────────────────────────────────────────────────── */
  .testi-card{padding:32px;border-radius:14px;position:relative;overflow:hidden}
  .testi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(127,189,175,0.3),transparent)}

  /* ── FAQ ─────────────────────────────────────────────────────────────── */
  .faq-item{border-bottom:1px solid rgba(255,255,255,0.07);padding:28px 0}

  /* ── Stats bar ───────────────────────────────────────────────────────── */
  .stats-bar{border-top:1px solid rgba(255,255,255,0.06);
    border-bottom:1px solid rgba(255,255,255,0.06);
    padding:24px;background:rgba(255,255,255,0.015)}

  /* ── Responsive ──────────────────────────────────────────────────────── */
  @media(max-width:768px){
    .hero-card{display:none}
    .grid-3{grid-template-columns:1fr!important}
    .grid-2{grid-template-columns:1fr!important}
    .nav-links{display:none}
    .nav-inner{padding:14px 20px}
    .hero{padding:100px 20px 60px}
    .sec-pad{padding:64px 20px!important}
    .step-grid{grid-template-columns:1fr!important;gap:2px 0!important}
    .step-item:not(:last-child){border-radius:12px 12px 0 0!important}
    .step-item:last-child{border-radius:0 0 12px 12px!important}
    .step-item:not(:first-child):not(:last-child){border-radius:0!important}
  }
`;

export default function LandingPage() {
  return (
    <main style={{ background: "#09090F", color: "#F0EEE8", fontFamily: "'DM Sans',-apple-system,sans-serif", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="serif" style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.02em", color: "#F0EEE8" }}>
            bio<span style={{ color: "#7FBDAF" }}>.</span>protocol
          </span>
          <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <Link href="#how-it-works" className="nav-link">How it works</Link>
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#faq" className="nav-link">FAQ</Link>
            <Link href="/auth/login" className="nav-link">Sign in</Link>
            <Link href="/quiz" className="nav-cta">Begin assessment →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-glow-3" />

        {/* Floating ambient cards */}
        <div className="hero-card hero-card-a">
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>Moon Phase</div>
          <div style={{ fontSize: 16, marginBottom: 3 }}>🌒</div>
          <div style={{ fontSize: 11, color: "#9DC4B8", fontWeight: 500 }}>Waxing Crescent</div>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Begin new protocols</div>
        </div>
        <div className="hero-card hero-card-b">
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Wellness Score</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 28, color: "#7FBDAF", lineHeight: 1, marginBottom: 2 }}>84<span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>/100</span></div>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>Radiant Pitta · RP-2</div>
        </div>
        <div className="hero-card hero-card-c">
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Today's Priority</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#F0EEE8", marginBottom: 2 }}>❄️ Cold Exposure</div>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>07:00 · 2 min plunge</div>
        </div>
        <div className="hero-card hero-card-d">
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {["Ashwagandha", "NMN", "CoQ10"].map(s => (
              <span key={s} style={{ fontSize: 8.5, background: "rgba(127,189,175,0.12)", color: "#7FBDAF", padding: "2px 6px", borderRadius: 4 }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Today's stack · 3 priority</div>
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 680, position: "relative", zIndex: 2 }}>
          <div className="shimmer-badge fu d1" style={{ marginBottom: 36 }}>
            ✦ Precision Anti-Aging Platform
          </div>

          <h1 className="serif fu d2" style={{ fontSize: "clamp(46px,7.5vw,82px)", fontWeight: 300, lineHeight: 1.07, marginBottom: 24, letterSpacing: "-0.025em" }}>
            Your biological<br />
            <em style={{ color: "#9DC4B8" }}>blueprint</em>
            {" "}for longevity
          </h1>

          <p className="fu d3" style={{ fontSize: 16, color: "rgba(255,255,255,0.44)", lineHeight: 1.85, maxWidth: 500, margin: "0 auto 40px", letterSpacing: "0.01em" }}>
            50 questions. 8 minutes. A personalized anti-aging protocol
            delivered to your inbox — free. Built on your unique bio type,
            hormonal signals, and lifestyle patterns.
          </p>

          <div className="fu d4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <Link href="/quiz" className="cta-primary">Begin your free assessment →</Link>
            <Link href="#how-it-works" className="cta-ghost">See how it works</Link>
          </div>

          <p className="fu d5" style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em" }}>
            Free · No credit card · Private by design
          </p>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
      <div className="stats-bar">
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
          {[
            ["4", "Bio Human Types"],
            ["50", "Assessment questions"],
            ["8 min", "Average completion"],
            ["Free", "PDF report, always"],
          ].map(([val, label]) => (
            <div key={val} style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 22, fontWeight: 400, color: "#7FBDAF", marginBottom: 3, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="sec-pad" style={{ padding: "100px 24px", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="sec-eyebrow">The process</div>
          <h2 className="sec-h">From assessment to protocol<br /><span className="sec-em">in three steps</span></h2>
        </div>

        <div className="step-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
          {[
            { num: "01", icon: "∞", title: "Complete the assessment", desc: "50 questions across 8 biological domains — sleep, energy, hormones, stress, nutrition, movement, skin, and longevity mindset. Takes 8 minutes.", col: "#7FBDAF", br: "12px 0 0 12px" },
            { num: "02", icon: "⬡", title: "Receive your free report", desc: "A precision PDF lands in your inbox — your bio type, top priority interventions, 6-compound supplement stack, morning protocol, and lunar sync guide.", col: "#C4965A", br: "0" },
            { num: "03", icon: "≡", title: "Access the platform", desc: "Upgrade to the full bio.protocol platform for your live dashboard, biomarker tracker, habit calendar with moon overlay, and menopause stage map.", col: "#7B6FA8", br: "0 12px 12px 0" },
          ].map((step) => (
            <div key={step.num} className="step-item glass" style={{ borderRadius: step.br, padding: "36px 32px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <span className="mono" style={{ fontSize: 10, color: step.col, letterSpacing: "0.15em" }}>{step.num}</span>
                <span style={{ fontSize: 20, color: step.col, opacity: 0.7 }}>{step.icon}</span>
              </div>
              <div style={{ height: 2, background: `linear-gradient(90deg,${step.col}60,transparent)`, marginBottom: 20, borderRadius: 1 }} />
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, lineHeight: 1.3, color: "#F0EEE8" }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" className="sec-pad" style={{ padding: "0 24px 100px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="sec-eyebrow">Platform features</div>
          <h2 className="sec-h">Everything connected<br /><span className="sec-em">to your biology</span></h2>
        </div>

        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feat-card glass" style={{ background: f.bg, borderColor: f.col + "25" }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: f.col + "18", border: `1px solid ${f.col}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 18, color: f.col }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: "#F0EEE8", letterSpacing: "0.01em" }}>{f.title}</h3>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REPORT PREVIEW ──────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "100px 24px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, background: "radial-gradient(ellipse,rgba(127,189,175,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="sec-eyebrow">What you receive</div>
            <h2 className="sec-h">Your free bio.protocol report<br /><span className="sec-em">is a premium document</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
            {/* Report mockup */}
            <div style={{ background: "#0A0C12", borderRadius: 14, padding: 28, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#7FBDAF,transparent)" }} />
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 400, color: "#F0EEE8", marginBottom: 4 }}>
                bio<span style={{ color: "#7FBDAF" }}>.</span>protocol
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: 24 }}>PERSONAL REPORT · CONFIDENTIAL</div>

              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: "#F0EEE8", lineHeight: 1.1, marginBottom: 6 }}>
                Your personal<br /><em style={{ color: "#9DC4B8" }}>bio.protocol</em>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[["Bio Type", "Lunar Kapha"], ["Code", "LK-7"], ["Score", "78/100"], ["Stage", "Late Peri"]].map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#F0EEE8", fontWeight: 400 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Contents</div>
              {["Bio Human Type Analysis", "Priority Interventions", "Biomarker Reference Panel", "Morning Ritual Protocol", "Supplement Stack", "Moon Cycle Sync Guide"].map((item, i) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, color: "#7FBDAF", opacity: 0.6 }}>0{i + 1}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Included items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "⬡", title: "Bio Human Type", detail: "Your biological archetype — what it means, why it matters, how it shapes every recommendation.", col: "#7FBDAF" },
                { icon: "◈", title: "Biomarker Reference Panel", detail: "8 key markers with research-informed optimal ranges for your age bracket and hormonal stage.", col: "#7B6FA8" },
                { icon: "≡", title: "Morning Ritual Protocol", detail: "A sequenced morning protocol calibrated for your cortisol awakening response and bio type.", col: "#C4965A" },
                { icon: "◐", title: "Priority Supplement Stack", detail: "6 compounds selected and dosed for your specific type, with timing and sourcing guidance.", col: "#C47FA0" },
                { icon: "◎", title: "Moon Cycle Sync Guide", detail: "How to time key interventions with the lunar cycle for 20–40% amplified results.", col: "#8FAA6B" },
              ].map((item) => (
                <div key={item.title} className="glass" style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.18s" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: item.col + "18", border: `1px solid ${item.col}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, color: item.col }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#F0EEE8", marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>{item.detail}</div>
                  </div>
                </div>
              ))}

              <Link href="/quiz" className="cta-primary" style={{ marginTop: 6, justifyContent: "center" }}>
                Get your free report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="sec-eyebrow">From the community</div>
            <h2 className="sec-h">Real biology, <span className="sec-em">real results</span></h2>
          </div>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card glass">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 9.5, background: "rgba(127,189,175,0.1)", color: "#7FBDAF", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.05em" }}>{t.type}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: "#7FBDAF" }}>{t.score}<span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginLeft: 2 }}>/100</span></div>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.8, marginBottom: 22, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#F0EEE8" }}>{t.name}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.25)", marginTop: 3, letterSpacing: "0.04em" }}>{t.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIO TYPES ───────────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="sec-eyebrow">The four archetypes</div>
            <h2 className="sec-h">Which bio type<br /><span className="sec-em">are you?</span></h2>
          </div>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { type: "Lunar Kapha", code: "LK", col: "#7FBDAF", desc: "Deep reserves, slower metabolism, strong lunar sensitivity. Thrives with consistency, grounding rituals, and hormonal attunement." },
              { type: "Radiant Pitta", code: "RP", col: "#C4965A", desc: "Hot, efficient metabolism with strong drive. Tendency to overstimulate. Protocol focuses on cooling, recovery, and anti-inflammatory mastery." },
              { type: "Balanced Vata", code: "BV", col: "#8FAA6B", desc: "Adaptive and sensitive. System responds quickly to lifestyle inputs. The right protocol creates fast, visible results." },
              { type: "Adaptive Vata", code: "AV", col: "#C47FA0", desc: "High nervous system sensitivity, reactive biology. Protocol built around adrenal recovery, nervous system regulation, and deep nourishment." },
            ].map((bt) => (
              <div key={bt.type} className="glass" style={{ padding: "24px", borderLeft: `2px solid ${bt.col}50`, borderRadius: "0 12px 12px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: bt.col, background: bt.col + "15", padding: "3px 8px", borderRadius: 4 }}>{bt.code}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 400, color: "#F0EEE8" }}>{bt.type}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}>{bt.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Your type is revealed after the 50-question assessment.</p>
            <Link href="/quiz" className="cta-primary" style={{ fontSize: 14 }}>Discover your bio type →</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="sec-h">Common <span className="sec-em">questions</span></h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <div style={{ fontSize: 15, fontWeight: 500, color: "#F0EEE8", marginBottom: 10, letterSpacing: "0.01em" }}>{faq.q}</div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "120px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: "radial-gradient(ellipse,rgba(127,189,175,0.11) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "0%", width: 400, height: 400, background: "radial-gradient(circle,rgba(123,111,168,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 40, marginBottom: 28, animation: "pulseGlow 3s ease-in-out infinite" }}>🌑</div>
          <h2 className="serif" style={{ fontSize: "clamp(34px,5.5vw,56px)", fontWeight: 300, lineHeight: 1.12, marginBottom: 18, letterSpacing: "-0.02em" }}>
            Begin your<br /><em style={{ color: "#9DC4B8" }}>biological discovery</em>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.8, marginBottom: 38 }}>
            Free. 8 minutes. Your personalized protocol, delivered to your inbox.<br />
            No credit card. No commitment. Just your biology.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quiz" className="cta-primary" style={{ fontSize: 15, padding: "16px 38px" }}>
              Take the free assessment →
            </Link>
            <Link href="/auth/login" className="cta-ghost">
              Sign into platform
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <span className="serif" style={{ fontSize: 17, fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>
            bio<span style={{ color: "#7FBDAF" }}>.</span>protocol
          </span>
          <div style={{ display: "flex", gap: 28 }}>
            {["Privacy Policy", "Terms of Service", "Contact"].map(label => (
              <Link key={label} href="#" style={{ fontSize: 11.5, color: "rgba(255,255,255,0.22)", letterSpacing: "0.04em", transition: "color 0.2s" }}>{label}</Link>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
            © {new Date().getFullYear()} bio.protocol · Private by design
          </span>
        </div>
      </footer>
    </main>
  );
}
