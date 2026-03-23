"use client";
import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { getPhase } from "@/lib/moon";
import { MENOPAUSE_STAGES } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  .bp{font-family:'DM Sans',-apple-system,sans-serif;background:#ECEAE5;min-height:100vh;display:flex;color:#0F1117}
  .bp-main{flex:1;padding:32px 36px;overflow-y:auto}
  .ph{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#0A0C12;margin-bottom:4px;letter-spacing:-0.01em}
  .ps{font-size:11px;color:#777E8A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px}
  .card{background:rgba(255,255,255,0.68);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.85);border-radius:14px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.04)}
  .card-dk{background:#0A0C12;border-radius:14px;padding:20px;color:white}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .lbl{font-size:10px;color:#9BA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px}
  .btn-save{width:100%;padding:12px;border-radius:10px;background:#0A0C12;color:white;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;margin-top:8px;transition:all 0.2s}
  .btn-save:hover{background:#1A1C24}
  .btn-save:disabled{opacity:0.5;cursor:not-allowed}
  .toast{position:fixed;bottom:24px;right:24px;background:#0A0C12;color:white;padding:10px 18px;border-radius:8px;font-size:12px;border:1px solid rgba(255,255,255,0.1);z-index:100}
`;

const SYMS = [
  {k:"hot_flashes",l:"Hot Flashes",i:"🌡️"},
  {k:"sleep",l:"Sleep Disturbance",i:"😴"},
  {k:"brain_fog",l:"Brain Fog",i:"🧠"},
  {k:"mood",l:"Mood Shifts",i:"🌊"},
  {k:"fatigue",l:"Fatigue",i:"⚡"},
];
const MPROTOS = [
  {i:"❄️",t:"Cold Contrast Therapy",d:"3-min cold exposure post-workout supports estrogen receptor sensitivity.",f:"3×/week"},
  {i:"🌿",t:"Lymphatic Morning Ritual",d:"Dry brushing + rebounding 10min clears metabolic waste during hormonal flux.",f:"Daily"},
  {i:"🥦",t:"Estrogen Detox Protocol",d:"DIM + broccoli sprouts + ground flaxseed for phase II liver estrogen metabolism.",f:"Daily"},
  {i:"☀️",t:"Cortisol Rhythm Reset",d:"Morning sunlight + no caffeine first 90min + ashwagandha PM. HPA axis reset.",f:"Daily"},
];

export default function MenopausePage() {
  const supabase = createClient();
  const moon = getPhase(new Date());
  const [stageIdx, setStageIdx] = useState(2);
  const [syms, setSyms] = useState<Record<string,number>>({hot_flashes:2,sleep:3,brain_fog:2,mood:2,fatigue:3});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().slice(0,10);

  const load = useCallback(async () => {
    const { data:{user} } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("symptom_logs").select("*").eq("user_id",user.id).eq("logged_date",today).single();
    if (data) { setSyms({hot_flashes:data.hot_flashes,sleep:data.sleep,brain_fog:data.brain_fog,mood:data.mood,fatigue:data.fatigue}); setSaved(true); }
  }, [supabase,today]);

  useEffect(() => { load(); },[load]);

  const save = async () => {
    setSaving(true);
    const { data:{user} } = await supabase.auth.getUser();
    if (user) await supabase.from("symptom_logs").upsert({user_id:user.id,logged_date:today,menopause_stage:stageIdx,...syms},{onConflict:"user_id,logged_date"});
    setSaving(false); setSaved(true);
    setToast("Today's log saved ✓");
    setTimeout(()=>setToast(""),2400);
  };

  const cur = MENOPAUSE_STAGES[stageIdx];
  return (
    <div className="bp"><style>{CSS}</style><Sidebar/>
      <main className="bp-main">
        <div className="ph">Menopause Tracker</div>
        <div className="ps">Hormonal journey map · Stage tracking & daily logging</div>
        <div className="card" style={{marginBottom:14}}>
          <div className="lbl">Your Hormonal Stage</div>
          <div style={{display:"flex",position:"relative",margin:"16px 0 24px"}}>
            {MENOPAUSE_STAGES.map((s,i) => {
              const active=i===stageIdx, past=i<stageIdx;
              return (
                <div key={s.id} style={{flex:1,textAlign:"center",position:"relative",cursor:"pointer"}} onClick={()=>setStageIdx(i)}>
                  {i<MENOPAUSE_STAGES.length-1&&<div style={{position:"absolute",top:9,left:"50%",right:"-50%",height:2,zIndex:0,background:active||past?s.col:"rgba(0,0,0,0.08)"}}/>}
                  <div style={{width:20,height:20,borderRadius:"50%",margin:"0 auto 6px",position:"relative",zIndex:1,border:`2px solid ${s.col}`,background:active?s.col:past?s.col+"60":"transparent",boxShadow:active?`0 0 0 4px ${s.col}22`:"none",transform:active?"scale(1.35)":"scale(1)",transition:"all 0.2s"}}/>
                  <div style={{fontSize:9.5,fontWeight:500,color:active?s.col:past?"#374151":"#9BA3AF"}}>{s.name}</div>
                  <div style={{fontSize:8.5,color:"#9BA3AF",marginTop:1}}>{s.sub}</div>
                </div>
              );
            })}
          </div>
          <div style={{background:cur.col+"10",border:`1px solid ${cur.col}28`,borderRadius:10,padding:14}}>
            <div style={{fontSize:13,fontWeight:500,color:cur.col,marginBottom:4}}>{cur.full}</div>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.65}}>Tracking your symptoms across the hormonal transition creates patterns that inform protocol adjustments. Log daily for best insights.</div>
          </div>
        </div>
        <div className="g2">
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div className="lbl" style={{margin:0}}>Today&apos;s Symptom Log</div>
              {saved&&<span style={{fontSize:9,background:"rgba(46,138,94,0.1)",color:"#2E8A5E",padding:"2px 7px",borderRadius:4}}>Saved today</span>}
            </div>
            {SYMS.map(s=>(
              <div key={s.k} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontSize:12}}>{s.i} {s.l}</div>
                  <div style={{fontFamily:"monospace",fontSize:11,color:"#9BA3AF"}}>{syms[s.k]}/5</div>
                </div>
                <input type="range" min="0" max="5" value={syms[s.k]} style={{width:"100%",accentColor:cur.col}}
                  onChange={e=>setSyms(p=>({...p,[s.k]:+e.target.value}))}/>
              </div>
            ))}
            <button className="btn-save" onClick={save} disabled={saving}>
              {saving?"Saving...":saved?"Update today's log ✓":"Save today's log →"}
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="card-dk" style={{borderRadius:14}}>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <span style={{fontSize:22}}>{moon.sym}</span>
                <div><div style={{fontSize:10,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Moon Sync</div><div style={{fontSize:13,fontWeight:500}}>{moon.name}</div></div>
              </div>
              <div style={{fontSize:11.5,color:"rgba(255,255,255,0.48)",lineHeight:1.6,marginBottom:10}}>{moon.energy}</div>
              <div style={{fontSize:11,color:"rgba(127,181,166,0.85)",lineHeight:1.6,padding:10,background:"rgba(127,181,166,0.08)",borderRadius:8}}>✦ {moon.tip}</div>
            </div>
            <div className="card"><div className="lbl">Stage Protocol</div>
              {MPROTOS.map(p=>(
                <div key={p.t} style={{display:"flex",gap:10,marginBottom:12}}>
                  <span style={{fontSize:17,flexShrink:0}}>{p.i}</span>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <div style={{fontSize:12,fontWeight:500}}>{p.t}</div>
                      <span style={{fontSize:9.5,color:"#9BA3AF",background:"rgba(0,0,0,0.04)",padding:"1px 6px",borderRadius:4}}>{p.f}</span>
                    </div>
                    <div style={{fontSize:11,color:"#6B7280",lineHeight:1.4}}>{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {toast&&<div className="toast">{toast}</div>}
      </main>
    </div>
  );
}
