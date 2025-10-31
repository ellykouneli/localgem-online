"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- helpers ---
  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  function clearMsg() {
    if (msg) setMsg(null);
  }

  /** Check if email or username is already taken (server-side) */
  const checkAvailability = useCallback(async () => {
    const q = new URLSearchParams();
    if (email.trim()) q.set("email", email.trim().toLowerCase());
    if (username.trim()) q.set("username", username.trim().toLowerCase());
    if (!q.toString()) return true; // nothing to check

    try {
      const res = await fetch(`/api/auth/check-availability?${q.toString()}`);
      const data = await res.json();
      if (data?.taken) {
        setMsg("That email or username is already in use.");
        return false;
      }
      return true;
    } catch (e) {
      console.warn("availability check failed:", e);
      // Don't block signup purely because of a network hiccup
      return true;
    }
  }, [email, username]);

  /** Submit handler */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // quick client-side validation
    if (!emailOk) {
      setMsg("Please enter a valid email address.");
      return;
    }
    if (username.trim().length < 3) {
      setMsg("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const available = await checkAvailability();
    if (!available) {
      setLoading(false);
      return;
    }

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
          // Hide internal backend strings (e.g., “Invalid API key”).
          setMsg("Something went wrong. Please try again.");
        }
        return;
      }

      // Success UX (you can auto-redirect or ask them to sign in)
      setMsg("✅ Account created! You can now sign in.");
      setTimeout(() => router.push("/signin"), 1200);
    } catch (err) {
      console.error(err);
      setMsg("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-center mb-4">
          Create a LocalGem Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onBlur={checkAvailability}
          onChange={(e) => {
            setEmail(e.target.value);
            clearMsg();
          }}
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
          autoComplete="email"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onBlur={checkAvailability}
          onChange={(e) => {
            setUsername(e.target.value);
            clearMsg();
          }}
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
          minLength={3}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearMsg();
          }}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
          minLength={6}
          autoComplete="new-password"
        />

        {msg && (
          <p
            className={`text-sm text-center mb-3 ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
            aria-live="polite"
          >
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-emerald-700 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}
