"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { useI18n, type Locale } from "@/lib/i18n/I18nProvider";
import { LOCALE_FLAGS, LOCALE_NAMES } from "@/lib/i18n/config";
import { useBackup } from "@/lib/backup/BackupProvider";
import type { ScheduleFreq } from "@/lib/backup/types";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Card } from "@/components/ui/Card";

const FREQS: { value: ScheduleFreq; key: string }[] = [
  { value: "daily", key: "backup.scheduleDaily" },
  { value: "weekly", key: "backup.scheduleWeekly" },
  { value: "off", key: "backup.scheduleOff" },
];

export default function SettingsPage() {
  const { t, locale, setLocale, locales } = useI18n();
  const { state, setSchedule } = useBackup();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <GhostMascot size={56} state="idle" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("nav.settings")}
          </h1>
        </div>
      </div>

      <Card className="mb-4">
        <p className="mb-3 text-sm font-medium text-white/70">
          {t("language.label")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {locales.map((l: Locale) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                locale === l
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <span className="text-base">{LOCALE_FLAGS[l]}</span>
              {LOCALE_NAMES[l]}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-medium text-white/70">
          {t("backup.schedule")}
        </p>
        <div className="flex flex-wrap gap-2">
          {FREQS.map((f) => (
            <button
              key={f.value}
              onClick={() => setSchedule(f.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                state.schedule === f.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
