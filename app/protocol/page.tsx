"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getPhase } from "@/lib/moon";
import { PROTOCOLS } from "@/lib/data";

const TABS = Object.keys(PROTOCOLS);
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap');
  .bp{font-family:'DM Sans',-apple-system,sans-serif;background:#ECEAE5;min-height:100vh;display:flex;color:#0F1117}
  .bp-main{flex:1;padding:32px 36px;overflow-y:auto}
  .ph{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#0A0C12;margin-bottom:4px;letter-spacing:-0.01em}
  .ps{font-size:11px;color:#777E8A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px}
  .card{background:rgba(255,255,255,0.68);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.85);border-radius:14px;padding:20px;margin-bottom:14px}
  .tp{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
  .tc{padding:6px 14px;border-radius:100px;font-size:11.5px;cursor:pointer;transition:all 0.16s;white-space:nowrap;border:1px solid transparent}
  .tc.on{background:#0A0C12;color:white;border-color:#0A0C12}
  .tc:not(.on){background:rgba(255,255,255,0.7);color:#6B7280;border-color:rgba(0,0,0,0.08)}
  .tc:not(.on):hover{background:rgba(255,255,255,0.95);color:#111318}
  .tl-row{display:flex;gap:12px;padding-bottom:18px;position:relative}
  .tl-row:not(:last-child)::after{content:'';position:absolute;left:53px;top:30px;bottom:0;width:1px;background:rgba(0,0,0,0.07)}
`;

export default function ProtocolPage() {
  const [tab, setTab] = useState(TABS[0]);
  const moon = getPhase(new Date());
  const items = PROTOCOLS[tab] ?? [];
  return (
    <div className="bp"><style>{CSS}</style><Sidebar/>
      <main className="bp-main">
        <div className="ph">My Protocol</div>
        <div className="ps">Personalized anti-aging protocol · Lunar Kapha · LK-7</div>
        <div className="tp">
          {TABS.map(t=><div key={t} className={`tc${tab===t?" on":""}`} onClick={()=>setTab(t)}>{t}</div>)}
        </div>
        <div className="card">
          {items.map(item=>(
            <div key={item.a} className="tl-row">
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:"#9BA3AF",width:44,paddingTop:6,textAlign:"right",flexShrink:0,letterSpacing:"0.04em"}}>{item.t}</div>
              <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,border:"1px solid rgba(0,0,0,0.06)"}}>{item.i}</div>
              <div>
                <div style={{fontSize:13,fontWeight:500,marginBottom:2,color:"#0F1117"}}>{item.a}</div>
                <div style={{fontSize:11.5,color:"#6B7280",lineHeight:1.5}}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{background:"rgba(127,181,166,0.07)",border:"1px solid rgba(127,181,166,0.18)"}}>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <span style={{fontSize:20}}>{moon.sym}</span>
            <div><div style={{fontSize:12,fontWeight:500}}>Moon-Synced Today · {moon.name}</div><div style={{fontSize:11,color:"#6B7280"}}>{moon.energy}</div></div>
          </div>
          <div style={{fontSize:12,color:"#374151",lineHeight:1.6,padding:"10px 12px",background:"rgba(255,255,255,0.5)",borderRadius:8}}>✦ {moon.tip}</div>
        </div>
      </main>
    </div>
  );
}
