"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import CommunityScene from '@/components/community-scene';
import { readApiResponse } from '@/features/workflow/api-response';
import { signInDestination } from '@/features/workflow/sign-in-destination';

export default function LoginPage() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    if (loading || !event.currentTarget.reportValidity()) return;

    setLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setMessage("Sign-in failed. Check your details and try again."); return; }
      const sessionResponse=await fetch('/api/session',{cache:'no-store'});
      const actor = await readApiResponse(sessionResponse);
      const next = new URLSearchParams(window.location.search).get('next');
      window.location.assign(signInDestination(actor.role, next));
    } catch { setMessage("Sign-in is unavailable. Please try again later."); }
    finally { setLoading(false); }
  }

  return (
    <div className="sign-in-layout">
      <div className="sign-in-intro">
        <p className="eyebrow">Your community, connected</p>
        <h1>Good to<br />have you here.</h1>
        <p>Sign in to submit a request, follow its progress or continue your work with the service team.</p>
        <CommunityScene />
      </div>

      <form onSubmit={handleLogin} className="form-card" noValidate aria-busy={loading}>
        <p className="eyebrow">CivicConnect account</p>
        <h2>Sign in</h2>
        <p className="form-intro">Use your existing account to continue.</p>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {message && <p role="alert">{message}</p>}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
