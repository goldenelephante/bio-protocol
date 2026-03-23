"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { SUPPLEMENTS } from "@/lib/data";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap');
  .bp{font-family:'DM Sans',-apple-system,sans-serif;background:#ECEAE5;min-height:100vh;display:flex;color:#0F1117}
  .bp-main{flex:1;padding:32px 36px;overflow-y:auto}
  .ph{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#0A0C12;margin-bottom:4px;letter-spacing:-0.01em}
  .ps{font-size:11px;color:#777E8A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px}
  .tp{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
  .tc{padding:6px 14px;border-radius:100px;font-size:11.5px;cursor:pointer;transition:all 0.16s;white-space:nowrap;border:1px solid transparent}
  .tc.on{background:#0A0C12;color:white;border-color:#0A0C12}
  .tc:not(.on){background:rgba(255,255,255,0.7);color:#6B7280;border-color:rgba(0,0,0,0.08)}
  .tc:not(.on):hover{background:rgba(255,255,255,0.95);color:#111318}
  .sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .scard{padding:14px;border-radius:12px;background:rgba(255,255,255,0.65);border:1px solid rgba(0,0,0,0.06);transition:all 0.16s}
  .scard:hover{background:rgba(255,255,255,0.92);transform:translateY(-1px);box-shadow:0 4px 18px rgba(0,0,0,0.06)}
`;

export default function SupplementsPage() {
  const [cat, setCat] = useState(0);
  const cur = SUPPLEMENTS[cat];
  return (
    <div className="bp"><style>{CSS}</style><Sidebar/>
      <main className="bp-main">
        <div className="ph">Supplements</div>
        <div className="ps">Personalized stack · Lunar Kapha · Late Perimenopause</div>
        <div className="tp">
          {SUPPLEMENTS.map((s,i)=><div key={s.cat} className={`tc${cat===i?" on":""}`} onClick={()=>setCat(i)}>{s.icon} {s.cat}</div>)}
        </div>
        <div className="sg">
          {cur.items.map(item=>(
            <div key={item.n} className="scard">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:10,background:cur.bg,color:cur.col,padding:"2px 8px",borderRadius:100,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase"}}>{item.hi?"★ Priority":"Supportive"}</span>
                <span style={{fontSize:10,color:"#9BA3AF",background:"rgba(0,0,0,0.04)",padding:"2px 6px",borderRadius:4}}>{item.t}</span>
              </div>
              <div style={{fontSize:13,fontWeight:500,marginBottom:2,color:"#0F1117"}}>{item.n}</div>
              <div style={{fontFamily:"monospace",fontSize:11,color:cur.col,marginBottom:6}}>{item.d}</div>
              <div style={{fontSize:11,color:"#6B7280",lineHeight:1.5}}>{item.b}</div>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(255,255,255,0.65)",borderRadius:12,border:"1px solid rgba(0,0,0,0.06)",padding:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{cur.cat} — {cur.items.length} compounds</div><div style={{fontSize:11,color:"#6B7280"}}>Tailored for your biomarkers & hormonal stage</div></div>
          <div style={{fontSize:28}}>{cur.icon}</div>
        </div>
      </main>
    </div>
  );
}
