"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type Mode = "login" | "signup";

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#0f766e",
    color: "#fff",
  };

  function clearMsg() {
    if (msg) setMsg(null);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // quick client-side guard
    if (username.trim().length < 3 || password.length < 6) {
      setMsg("Username must be ≥ 3 chars, password ≥ 6 chars.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: email.trim(),
        username: username.trim(),
        password,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      console.log("register response:", data);

      if (!res.ok) {
        if (res.status === 409) {
          setMsg("That email or username is already in use.");
        } else if (res.status === 400) {
          setMsg("Please check your inputs and try again.");
        } else {
          // do not surface internal messages like "Invalid API key"
          setMsg("Could not sign up. Please try again.");
        }
        return;
      }

      // auto-login
      const result = await signIn("credentials", {
        username: payload.username,
        password: payload.password,
        redirect: false,
      });

      if (result?.error) {
        console.warn("auto-login error:", result.error);
        setMsg("Account created, but auto-login failed. Please sign in.");
        setMode("login");
        return;
      }

      // success
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setMsg("Invalid username or password");
        return;
      }
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1 style={{ marginBottom: 12, textAlign: "center" }}>
          Welcome to LocalGem
        </h1>

        {/* Google sign-in */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          disabled={loading}
          style={{
            ...fieldStyle,
            width: "100%",
            marginBottom: 12,
            background: "#fff",
            border: "1px solid #e5e7eb",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          Continue with Google
        </button>

        <div
          style={{ textAlign: "center", color: "#6b7280", margin: "8px 0" }}
          aria-hidden="true"
        >
          or
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignup} style={{ display: "grid", gap: 10 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearMsg();
              }}
              required
              autoComplete="email"
              style={fieldStyle}
            />

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearMsg();
              }}
              required
              minLength={3}
              autoComplete="username"
              style={fieldStyle}
            />

            <input
              type="password"
              placeholder="Password (min 6)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearMsg();
              }}
              required
              minLength={6}
              autoComplete="new-password"
              style={fieldStyle}
            />

            {msg && (
              <div style={{ color: "crimson" }} aria-live="polite">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating…" : "Sign up"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMsg(null);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#0f766e",
                cursor: "pointer",
              }}
            >
              I already have an account
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearMsg();
              }}
              required
              autoComplete="username"
              style={fieldStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearMsg();
              }}
              required
              autoComplete="current-password"
              style={fieldStyle}
            />

            {msg && (
              <div style={{ color: "crimson" }} aria-live="polite">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMsg(null);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#0f766e",
                cursor: "pointer",
              }}
            >
              Create a new account
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
