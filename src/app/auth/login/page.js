"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setMessage("Sign-in failed. Check your details and try again."); return; }
      const sessionResponse=await fetch('/api/session',{cache:'no-store'});
      const actor=sessionResponse.ok?await sessionResponse.json():null;
      window.location.assign(actor?.role==='manager'?'/management':actor?.role==='staff'?'/work':'/requests');
    } catch { setMessage("Sign-in is unavailable. Please try again later."); }
    finally { setLoading(false); }
  }

  return (
    <div className="narrow">
      <div className="page-heading">
        <p className="eyebrow">CivicConnect</p>
        <h1>Sign in</h1>
        <p className="lead">
          Sign in to submit and manage your service requests.
        </p>
      </div>

      <form onSubmit={handleLogin} className="form-card">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {message && <p role="alert">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
