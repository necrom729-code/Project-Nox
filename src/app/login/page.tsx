"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError(t("auth.error.invalid"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <GhostMascot size={88} state="idle" />
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {t("app.name")}
          </h1>
          <p className="text-sm text-white/50">{t("auth.login.subtitle")}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(["n", "e", "c", "r", "o", "m"] as const).map((l) => (
              <div
                key={l}
                className="flex w-12 flex-col items-center rounded-lg bg-white/5 px-1 py-1.5"
              >
                <span className="text-sm font-black text-indigo-300 uppercase">
                  {l}
                </span>
                <span className="text-[10px] leading-tight text-white/60">
                  {t(`acronym.${l}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div>
            <label className="mb-1 block text-sm text-white/70">
              {t("common.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.login.emailPlaceholder")}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">
              {t("common.password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.login.passwordPlaceholder")}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? t("common.loading") : t("auth.login.submit")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-white/60">
          {t("auth.login.noAccount")}{" "}
          <Link href="/register" className="font-semibold text-indigo-300">
            {t("auth.login.register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
