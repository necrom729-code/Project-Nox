"use client";

import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Button } from "@/components/ui/Button";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const PERSONALITIES = ["Childish", "Kind", "Helpful", "Playful", "Serious"] as const;

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

function pickReply(text: string, t: (k: string) => string): string {
  const q = text.toLowerCase();
  if (/(backup|back up|save|schedul|automatically)/.test(q))
    return t("assistant.replyBackup");
  if (/(restore|recover|retriev|resurrect|back)/.test(q))
    return t("assistant.replyRestore");
  if (
    /(language|lang|translat|français|french|thai|japanese|deutsch|german|russian|korean|italian|malay|indonesian|español)/.test(
      q,
    )
  )
    return t("assistant.replyLanguage");
  return t("assistant.fallback");
}

export default function AssistantPage() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", role: "assistant", text: t("assistant.welcome") },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [personalities, setPersonalities] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  function scrollToEnd() {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function togglePersonality(p: string) {
    setPersonalities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  async function send() {
    const text = input.trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { id: cryptoId(), role: "user", text }]);
    setInput("");
    setThinking(true);
    scrollToEnd();

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          personalities,
          locale,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const reply: string = data.reply ?? t("assistant.fallback");
      setMessages((m) => [
        ...m,
        { id: cryptoId(), role: "assistant", text: reply },
      ]);
    } catch {
      const reply = pickReply(text, t);
      setMessages((m) => [
        ...m,
        { id: cryptoId(), role: "assistant", text: reply },
      ]);
    } finally {
      setThinking(false);
      scrollToEnd();
    }
  }

  function clear() {
    setMessages([{ id: "welcome", role: "assistant", text: t("assistant.welcome") }]);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-2xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <GhostMascot size={48} state="idle" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("assistant.title")}
          </h1>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {PERSONALITIES.map((p) => (
          <label
            key={p}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
              personalities.includes(p)
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={personalities.includes(p)}
              onChange={() => togglePersonality(p)}
            />
            <span className="peer-checked:hidden">+</span>
            <span className="hidden peer-checked:inline">-</span>
            {p}
          </label>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && <GhostMascot size={32} state="idle" />}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white/90"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <GhostMascot size={32} state="idle" />
            <span>{t("assistant.thinking")}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("assistant.placeholder")}
          className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        />
        <Button onClick={send} disabled={thinking || !input.trim()}>
          <Send size={16} /> {t("assistant.send")}
        </Button>
        <Button variant="secondary" onClick={clear}>
          {t("assistant.clear")}
        </Button>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" />
          <span className="font-semibold text-white/90">NECROM</span>
        </div>
        <ul className="mt-2 space-y-1 text-white/70">
          <li><strong>N</strong> = Network</li>
          <li><strong>E</strong> = Efficient</li>
          <li><strong>C</strong> = Cloud</li>
          <li><strong>R</strong> = Recovery</li>
          <li><strong>O</strong> = Operations</li>
          <li><strong>M</strong> = Manager</li>
        </ul>
      </div>
    </div>
  );
}