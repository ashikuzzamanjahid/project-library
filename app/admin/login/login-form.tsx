"use client";

import Link from "next/link";
import { useState } from "react";

export function AdminLogin({ returnTo }: { returnTo: string }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Login failed.");
      window.location.assign(returnTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={signIn}>
        <Link href="/">← Project library</Link>
        <span className="login-label">PRIVATE AREA</span>
        <h1>Owner editor</h1>
        <p>
          Enter the private admin password to add projects, upload screenshots,
          and edit library entries.
        </p>
        <label>
          <span>Admin password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>
        {message && <div role="alert">{message}</div>}
        <button type="submit" disabled={busy}>
          {busy ? "Checking…" : "Open editor"}
        </button>
        <small>
          The password is verified on the server and is never stored in the
          website source.
        </small>
      </form>
    </main>
  );
}
