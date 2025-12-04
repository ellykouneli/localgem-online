"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AskMeAnything() {
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState("");
  const [timeMin, setTimeMin] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! Tell me where you are and how much time you have. e.g. “40 minutes near the port”.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [msgs, open]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function send(message?: string) {
    const text = (message ?? input).trim();
    if (!text) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          area: area || undefined,
          timeMinutes: timeMin ? Number(timeMin) : undefined,
          history: msgs.slice(-6),
        }),
      });
      const json = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: json.reply ?? "…" }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "Network hiccup. Try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button — has inline fallback so it floats even without Tailwind */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ask me anything"
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 60 }}
        className="rounded-full px-5 py-4 shadow-lg text-white bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:scale-105 transition flex items-center gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Ask me anything</span>
      </button>

      {open && (
        <div
          style={{ position: "fixed", bottom: 20, right: 20, zIndex: 61 }}
          className="w-[92vw] max-w-md rounded-2xl border bg-white shadow-xl overflow-hidden"
        >
          <header className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-50 to-fuchsia-50">
            <div className="font-semibold">Ask me anything</div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1 rounded-md hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="px-4 py-3 flex gap-2">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="flex-1 rounded-md border px-2 py-2 text-sm"
            >
              <option value="">Area (optional)</option>
              <option value="port">Port</option>
              <option value="center">Center</option>
              <option value="old_town">Old town</option>
              <option value="beach">Beach line</option>
            </select>
            <input
              value={timeMin}
              onChange={(e) => setTimeMin(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Time (min)"
              className="w-28 rounded-md border px-2 py-2 text-sm"
              inputMode="numeric"
            />
          </div>

          <div ref={scrollRef} className="px-4 h-72 overflow-y-auto space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    "inline-block rounded-2xl px-3 py-2 text-sm " +
                    (m.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-900")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Thinking…</div>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) send();
            }}
            className="flex items-center gap-2 px-4 py-3 border-t"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <button
              disabled={!canSend}
              className="rounded-lg px-3 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
