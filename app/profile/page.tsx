"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const LANGS = ["English","Español","Português","Italiano","Français","Deutsch"];
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  .bp{font-family:'DM Sans',-apple-system,sans-serif;background:#ECEAE5;min-height:100vh;display:flex;color:#0F1117}
  .bp-main{flex:1;padding:32px 36px;overflow-y:auto}
  .ph{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#0A0C12;margin-bottom:4px;letter-spacing:-0.01em}
  .ps{font-size:11px;color:#777E8A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px}
  .card{background:rgba(255,255,255,0.68);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.85);border-radius:14px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.04)}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .lbl{font-size:10px;color:#9BA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px}
  .lpill{padding:6px 14px;border-radius:100px;font-size:12px;cursor:pointer;transition:all 0.16s;border:1px solid rgba(0,0,0,0.1)}
`;

export default function ProfilePage() {
  const [lang, setLang] = useState("English");
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/quiz");
  };

  const SCORE_BARS = [
    {l:"Hormonal Balance",v:60,c:"#C47FA0"},
    {l:"Cellular Health",v:75,c:"#7B6FA8"},
    {l:"Lifestyle Adherence",v:82,c:"#5FA882"},
    {l:"Sleep Quality",v:71,c:"#5B8FA8"},
  ];

  const r=36, score=78, c=2*Math.PI*r, dash=(score/100)*c;

  return (
    <div className="bp"><style>{CSS}</style><Sidebar/>
      <main className="bp-main">
        <div className="ph">Profile</div>
        <div className="ps">Account settings & personal information</div>
        <div className="g2">
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card">
              <div style={{display:"flex",gap:14,marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#7FB5A6,#5B8A7A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"white",flexShrink:0}}>S</div>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:400}}>Sofia Marchetti</div>
                  <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>sofia@bio.protocol</div>
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <span style={{fontSize:9.5,background:"rgba(127,181,166,0.12)",color:"#5B9A8C",padding:"2px 8px",borderRadius:100,letterSpacing:"0.07em",textTransform:"uppercase"}}>Premium</span>
                    <span style={{fontSize:9.5,background:"rgba(0,0,0,0.05)",color:"#6B7280",padding:"2px 8px",borderRadius:100,letterSpacing:"0.07em",textTransform:"uppercase"}}>LK-7</span>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {[["Age","47"],["Bio Type","Lunar Kapha"],["Stage","Late Perimenopause"],["Member since","Jan 2026"]].map(([k,v])=>(
                  <div key={k} style={{background:"rgba(0,0,0,0.03)",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"#9BA3AF",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:12.5,fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={handleSignOut} style={{width:"100%",padding:"9px",borderRadius:8,background:"transparent",color:"#9BA3AF",fontSize:12,cursor:"pointer",border:"1px solid rgba(0,0,0,0.08)",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>Sign out</button>
            </div>
            <div className="card">
              <div className="lbl">Language</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {LANGS.map(l=>(
                  <div key={l} className="lpill" onClick={()=>setLang(l)}
                    style={{background:lang===l?"#0A0C12":"rgba(255,255,255,0.8)",color:lang===l?"white":"#374151",borderColor:lang===l?"#0A0C12":"rgba(0,0,0,0.1)"}}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card">
              <div className="lbl">Bio Protocol Report</div>
              <div style={{background:"linear-gradient(135deg,#0A0C12 0%,#182030 100%)",borderRadius:10,padding:20,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"white",marginBottom:4}}>bio.protocol Personal Report</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:12}}>Lunar Kapha · LK-7 · 2026</div>
                <button style={{background:"rgba(127,181,166,0.18)",color:"#9DC4B8",border:"1px solid rgba(127,181,166,0.2)",borderRadius:7,padding:"8px 14px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>↓ Download PDF Report</button>
              </div>
            </div>
            <div className="card">
              <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
                <svg width="88" height="88" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5"/>
                  <circle cx="44" cy="44" r={r} fill="none" stroke="#7FBDAF" strokeWidth="5"
                    strokeDasharray={`${dash} ${c-dash}`} strokeLinecap="round"
                    style={{transform:"rotate(-90deg)",transformOrigin:"44px 44px"}}/>
                  <text x="44" y="46" textAnchor="middle" fill="#0A0C12" fontSize="16" fontFamily="monospace">{score}</text>
                  <text x="44" y="57" textAnchor="middle" fill="#9BA3AF" fontSize="8" fontFamily="sans-serif" letterSpacing="1">/100</text>
                </svg>
                <div><div className="lbl">Wellness Score</div><div style={{fontFamily:"monospace",fontSize:22,fontWeight:400}}>{score}<span style={{fontSize:12,color:"#9BA3AF",marginLeft:4}}>/100</span></div></div>
              </div>
              {SCORE_BARS.map(s=>(
                <div key={s.l} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontSize:11,color:"#374151"}}>{s.l}</div>
                    <div style={{fontFamily:"monospace",fontSize:10,color:"#9BA3AF"}}>{s.v}%</div>
                  </div>
                  <div style={{height:3,background:"rgba(0,0,0,0.07)",borderRadius:100,overflow:"hidden"}}>
                    <div style={{width:`${s.v}%`,height:"100%",background:s.c,borderRadius:100}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
