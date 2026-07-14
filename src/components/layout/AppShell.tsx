"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  HardDriveUpload,
  FolderOpen,
  History,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useI18n, type Locale } from "@/lib/i18n/I18nProvider";
import { LOCALE_FLAGS, LOCALE_NAMES } from "@/lib/i18n/config";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { ScrollGhost } from "@/components/mascot/ScrollGhost";
import { Button } from "@/components/ui/Button";

const NAV = [
  { href: "/dashboard", key: "nav.overview", icon: LayoutDashboard },
  { href: "/dashboard/backup", key: "nav.backup", icon: HardDriveUpload },
  { href: "/dashboard/files", key: "nav.files", icon: FolderOpen },
  { href: "/dashboard/restore", key: "nav.restore", icon: History },
  { href: "/dashboard/settings", key: "nav.settings", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, locale, setLocale, locales } = useI18n();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white md:flex-row">
      <aside className="flex shrink-0 flex-row items-center gap-1 overflow-x-auto border-b border-white/10 bg-slate-900/60 p-3 md:w-64 md:flex-col md:items-stretch md:gap-2 md:border-b-0 md:border-r md:p-5">
        <div className="mb-2 hidden items-center gap-3 md:flex">
          <GhostMascot size={44} state="idle" />
          <div>
            <p className="text-lg font-black tracking-tight">{t("app.name")}</p>
            <p className="text-[11px] text-white/50">{t("app.tagline")}</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-row gap-1 md:flex-col">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600/90 text-white"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span>{t(key)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <p className="px-1 pb-1 text-[11px] uppercase tracking-wide text-white/40">
            {user?.email}
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/40 px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <GhostMascot size={32} state="idle" />
            <span className="font-black tracking-tight">{t("app.name")}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">{t("language.label")}</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {LOCALE_FLAGS[l]} {LOCALE_NAMES[l]}
                  </option>
                ))}
              </select>
            </label>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut size={16} />
              <span className="hidden sm:inline">{t("common.logout")}</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
      <ScrollGhost />
    </div>
  );
}
