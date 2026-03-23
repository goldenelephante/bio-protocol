"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPhase } from "@/lib/moon";

const NAVS = [
  { href:"/dashboard",   ic:"⬡", label:"Dashboard" },
  { href:"/protocol",    ic:"≡", label:"My Protocol" },
  { href:"/supplements", ic:"◈", label:"Supplements" },
  { href:"/habits",      ic:"▦", label:"Habits & Calendar" },
  { href:"/menopause",   ic:"◎", label:"Menopause Tracker" },
  { href:"/profile",     ic:"○", label:"Profile" },
];

interface SidebarProps {
  userName?: string;
  userType?: string;
  userCode?: string;
}

export default function Sidebar({ userName="User", userType="Lunar Kapha", userCode="LK-7" }: SidebarProps) {
  const pathname = usePathname();
  const moon = getPhase(new Date());
  const initials = userName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  return (
    <aside style={{width:220,flexShrink:0,background:"#0A0C12",minHeight:"100vh",position:"sticky",top:0,height:"100vh",display:"flex",flexDirection:"column",padding:"24px 14px",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .sb-ni{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:12.5px;color:rgba(255,255,255,0.42);transition:all 0.16s;letter-spacing:0.01em;text-decoration:none}
        .sb-ni:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.78)}
        .sb-ni.on{background:rgba(127,181,166,0.15);color:#9DC4B8;font-weight:500}
      `}</style>

      <div style={{fontFamily:"'Cormorant Garamond',serif",color:"#fff",fontSize:20,fontWeight:400,letterSpacing:"0.01em",marginBottom:24,paddingLeft:6,lineHeight:1.2}}>
        bio<span style={{color:"rgba(127,181,166,0.9)"}}>.</span>protocol
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:"0.22em",textTransform:"uppercase",display:"block",marginTop:3}}>Anti-aging platform</span>
      </div>

      <div style={{background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"10px 12px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#7FB5A6 0%,#5B8A7A 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#fff",flexShrink:0}}>
          {initials}
        </div>
        <div>
          <div style={{fontSize:12.5,color:"rgba(255,255,255,0.85)",fontWeight:500}}>{userName}</div>
          <div style={{fontSize:9.5,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:1}}>{userType} · {userCode}</div>
        </div>
      </div>

      <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
        {NAVS.map(n => (
          <Link key={n.href} href={n.href} className={`sb-ni${pathname===n.href?" on":""}`}>
            <span style={{fontSize:13,width:18,textAlign:"center",flexShrink:0}}>{n.ic}</span>
            {n.label}
          </Link>
        ))}
      </nav>

      <div style={{marginTop:"auto",paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{fontSize:22,marginBottom:4}}>{moon.sym}</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{moon.name}</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.22)",marginTop:3,lineHeight:1.4}}>{moon.energy}</div>
      </div>
    </aside>
  );
}
