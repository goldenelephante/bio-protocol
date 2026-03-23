"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.includes("@") || loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{background:"#09090F",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .inp{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:14px 18px;font-size:14px;font-family:'DM Sans',sans-serif;color:white;outline:none;transition:border 0.2s;width:100%}
        .inp:focus{border-color:rgba(127,189,175,0.5)}
        .inp::placeholder{color:rgba(255,255,255,0.2)}
        .cta{width:100%;padding:14px;border-radius:10px;background:#7FBDAF;color:#05120F;font-size:13.5px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.2s;letter-spacing:0.02em}
        .cta:hover:not(:disabled){background:#91C9BC}
        .cta:disabled{opacity:0.6;cursor:not-allowed}
      `}</style>
      <div style={{width:"100%",maxWidth:420,padding:32,textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"white",marginBottom:24}}>
          bio<span style={{color:"#7FBDAF"}}>.protocol</span>
        </div>
        {sent ? (
          <div style={{background:"rgba(127,189,175,0.08)",border:"1px solid rgba(127,189,175,0.2)",borderRadius:14,padding:32}}>
            <div style={{fontSize:32,marginBottom:12}}>✉️</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"white",marginBottom:8}}>Check your inbox</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.65}}>
              We sent a magic link to <strong style={{color:"rgba(255,255,255,0.7)"}}>{email}</strong>.<br/>
              Click it to access your bio.protocol platform.
            </p>
          </div>
        ) : (
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:32}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"white",marginBottom:6,fontWeight:300}}>Welcome back</div>
            <p style={{fontSize:12.5,color:"rgba(255,255,255,0.35)",marginBottom:24,lineHeight:1.6}}>Enter your email to receive a magic link — no password needed.</p>
            <input className="inp" type="email" placeholder="your@email.com" value={email}
              onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{marginBottom:10}}/>
            <button className="cta" onClick={handleLogin} disabled={loading}>
              {loading ? "Sending link..." : "Send magic link →"}
            </button>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.18)",marginTop:14,lineHeight:1.6}}>
              No account? Taking the quiz will create one automatically.<br/>
              <a href="/quiz" style={{color:"rgba(127,189,175,0.6)",textDecoration:"none"}}>Take the free bio assessment →</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
