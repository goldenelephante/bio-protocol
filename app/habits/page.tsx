"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { getMoonCalendar } from "@/lib/moon";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_HABITS } from "@/lib/data";

interface Habit { id: string; name: string; emoji: string; col: string; freq: string; }
interface Log { habit_id: string; logged_date: string; }

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap');
  .bp{font-family:'DM Sans',-apple-system,sans-serif;background:#ECEAE5;min-height:100vh;display:flex;color:#0F1117}
  .bp-main{flex:1;padding:32px 36px;overflow-y:auto}
  .ph{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#0A0C12;letter-spacing:-0.01em;margin-bottom:4px}
  .ps{font-size:11px;color:#777E8A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px}
  .card{background:rgba(255,255,255,0.68);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.85);border-radius:14px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.04)}
  .lbl{font-size:10px;color:#9BA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px}
  .cal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
  .cal-hd{font-size:9.5px;color:#9BA3AF;text-align:center;padding:4px 0;letter-spacing:0.07em;text-transform:uppercase}
  .cal-d{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;font-size:11px;color:#374151;transition:all 0.13s;position:relative}
  .cal-d:hover{background:rgba(255,255,255,0.7)}
  .cal-d.td{background:#0A0C12;color:white}
  .hrow{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,0.6);margin-bottom:6px;transition:all 0.15s}
  .hrow:hover{background:rgba(255,255,255,0.85)}
  .hchk{width:18px;height:18px;border-radius:5px;border:2px solid;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all 0.15s;flex-shrink:0}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.16s;border:none;font-family:'DM Sans',sans-serif}
  .btn-dk{background:#0A0C12;color:white}
  .btn-dk:hover{background:#1A1C24}
  .btn-sm{padding:6px 12px;font-size:11px}
  .inp{background:rgba(255,255,255,0.8);border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:8px 12px;font-size:12.5px;font-family:'DM Sans',sans-serif;color:#0F1117;outline:none;width:100%}
  .inp:focus{border-color:rgba(127,181,166,0.6);background:white}
  .save-toast{position:fixed;bottom:24px;right:24px;background:#0A0C12;color:white;padding:10px 18px;border-radius:8px;font-size:12px;border:1px solid rgba(255,255,255,0.1);transition:all 0.3s;z-index:100}
`;

const TODAY = new Date();
const YEAR = TODAY.getFullYear(), MONTH = TODAY.getMonth(), DAY = TODAY.getDate();
const DAYS_IN_MONTH = new Date(YEAR, MONTH+1, 0).getDate();
const FIRST_DOW = new Date(YEAR, MONTH, 1).getDay();
const MONTH_LABEL = TODAY.toLocaleDateString("en-US",{month:"long",year:"numeric"});
const TODAY_KEY = `${YEAR}-${String(MONTH+1).padStart(2,"0")}-${String(DAY).padStart(2,"0")}`;
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function HabitsPage() {
  const supabase = createClient();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({name:"",emoji:"🌿",col:"#9DC4B8"});
  const [toast, setToast] = useState("");
  const moonCal = getMoonCalendar(YEAR, MONTH);
  const moonMap: Record<number,{sym:string;type:string}> = {};
  moonCal.forEach(m => { moonMap[m.d] = m; });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Seed with defaults for demo
      setHabits(DEFAULT_HABITS.map(h => ({...h, id: String(h.id)})));
      return;
    }
    const { data: hData } = await supabase.from("habits").select("*").eq("user_id", user.id).order("created_at");
    if (hData && hData.length > 0) {
      setHabits(hData);
    } else {
      setHabits(DEFAULT_HABITS.map(h => ({...h, id: String(h.id)})));
    }
    const monthStart = `${YEAR}-${String(MONTH+1).padStart(2,"0")}-01`;
    const monthEnd   = `${YEAR}-${String(MONTH+1).padStart(2,"0")}-${DAYS_IN_MONTH}`;
    const { data: lData } = await supabase.from("habit_logs")
      .select("habit_id,logged_date").eq("user_id", user.id)
      .gte("logged_date", monthStart).lte("logged_date", monthEnd);
    if (lData) setLogs(new Set(lData.map((l:Log) => `${l.habit_id}-${l.logged_date}`)));
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleLog = async (habitId: string) => {
    const key = `${habitId}-${TODAY_KEY}`;
    const { data: { user } } = await supabase.auth.getUser();
    const isDone = logs.has(key);

    // Optimistic update
    setLogs(prev => {
      const next = new Set(prev);
      isDone ? next.delete(key) : next.add(key);
      return next;
    });

    if (!user) { showToast(isDone ? "Unmarked" : "Logged ✓"); return; }

    if (isDone) {
      await supabase.from("habit_logs").delete()
        .eq("user_id", user.id).eq("habit_id", habitId).eq("logged_date", TODAY_KEY);
    } else {
      await supabase.from("habit_logs").insert({ user_id: user.id, habit_id: habitId, logged_date: TODAY_KEY });
    }
    showToast(isDone ? "Unmarked" : "Logged & saved ✓");
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const tempId = `temp-${Date.now()}`;
    const habit: Habit = { id: tempId, name: newHabit.name, emoji: newHabit.emoji, col: newHabit.col, freq: "Daily" };
    setHabits(h => [...h, habit]);
    setNewHabit({name:"",emoji:"🌿",col:"#9DC4B8"});
    setAddOpen(false);
    if (user) {
      const { data } = await supabase.from("habits")
        .insert({user_id:user.id, name:habit.name, emoji:habit.emoji, col:habit.col, freq:habit.freq})
        .select().single();
      if (data) setHabits(h => h.map(x => x.id===tempId ? data : x));
    }
    showToast("Habit added ✓");
  };

  const removeHabit = async (id: string) => {
    setHabits(h => h.filter(x => x.id !== id));
    const { data: { user } } = await supabase.auth.getUser();
    if (user && !id.startsWith("temp")) {
      await supabase.from("habits").delete().eq("id", id).eq("user_id", user.id);
    }
    showToast("Habit removed");
  };

  const streakFor = (habitId: string) =>
    Array.from(logs).filter(k => k.startsWith(`${habitId}-`)).length;

  return (
    <div className="bp">
      <style>{CSS}</style>
      <Sidebar/>
      <main className="bp-main">
        <div className="ph">Habits & Calendar</div>
        <div className="ps">{MONTH_LABEL} · Habit tracking with lunar cycle markers</div>

        {/* Calendar */}
        <div className="card" style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>{MONTH_LABEL}</div>
              <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>🌑 New moon · 🌕 Full moon</div>
            </div>
          </div>
          <div className="cal">
            {WEEKDAYS.map(d => <div key={d} className="cal-hd">{d}</div>)}
            {Array.from({length:FIRST_DOW}).map((_,i) => <div key={`e${i}`}/>)}
            {Array.from({length:DAYS_IN_MONTH}).map((_,i) => {
              const d = i+1, isToday = d===DAY;
              const moon = moonMap[d];
              const todayLogs = habits.filter(h => logs.has(`${h.id}-${YEAR}-${String(MONTH+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`));
              return (
                <div key={d} className={`cal-d${isToday?" td":""}`}>
                  <span>{d}</span>
                  {moon ? (
                    <span style={{fontSize:9,lineHeight:1,opacity:isToday?0.6:1}}>{moon.sym}</span>
                  ) : todayLogs.length > 0 && (
                    <div style={{display:"flex",gap:2,marginTop:1}}>
                      {todayLogs.slice(0,3).map(h => (
                        <div key={h.id} style={{width:4,height:4,borderRadius:"50%",background:isToday?"rgba(255,255,255,0.6)":h.col}}/>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Habits list */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div className="lbl" style={{margin:0}}>Today — {TODAY.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
          <button className="btn btn-dk btn-sm" onClick={() => setAddOpen(!addOpen)}>+ Add habit</button>
        </div>

        {addOpen && (
          <div className="card" style={{marginBottom:12,padding:16}}>
            <div className="lbl">New Habit</div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input className="inp" style={{flex:1}} placeholder="Habit name..." value={newHabit.name}
                onChange={e=>setNewHabit(p=>({...p,name:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&addHabit()}/>
              <input className="inp" style={{width:46,textAlign:"center"}} placeholder="🌿"
                value={newHabit.emoji} onChange={e=>setNewHabit(p=>({...p,emoji:e.target.value}))}/>
              <input type="color" style={{width:36,height:36,border:"none",borderRadius:6,cursor:"pointer",padding:2}}
                value={newHabit.col} onChange={e=>setNewHabit(p=>({...p,col:e.target.value}))}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-dk btn-sm" onClick={addHabit}>Add</button>
              <button className="btn btn-sm" style={{background:"rgba(255,255,255,0.8)",color:"#374151",border:"1px solid rgba(0,0,0,0.1)"}}
                onClick={() => setAddOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

        {habits.map(h => {
          const done = logs.has(`${h.id}-${TODAY_KEY}`);
          return (
            <div key={h.id} className="hrow">
              <div className="hchk" style={{borderColor:h.col,background:done?h.col:"transparent",color:"white"}}
                onClick={() => toggleLog(h.id)}>{done&&"✓"}</div>
              <span style={{fontSize:15}}>{h.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:done?"#9BA3AF":"#0F1117",textDecoration:done?"line-through":"none"}}>{h.name}</div>
                <div style={{fontSize:10,color:"#9BA3AF"}}>{h.freq} · {streakFor(h.id)} logged this month</div>
              </div>
              <div style={{display:"flex",gap:2,marginRight:8}}>
                {Array.from({length:7}).map((_,i) => {
                  const d2 = DAY-6+i;
                  if (d2 < 1) return <div key={i} style={{width:6,height:6}}/>;
                  const dk = `${YEAR}-${String(MONTH+1).padStart(2,"0")}-${String(d2).padStart(2,"0")}`;
                  return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:logs.has(`${h.id}-${dk}`)?h.col:"rgba(0,0,0,0.09)"}}/>;
                })}
              </div>
              <span style={{cursor:"pointer",color:"#D1D5DB",fontSize:11}} onClick={() => removeHabit(h.id)}>✕</span>
            </div>
          );
        })}

        {toast && <div className="save-toast">{toast}</div>}
      </main>
    </div>
  );
}
