"use client";

import { useRef } from "react";
import { HardDriveUpload, Upload } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useBackup } from "@/lib/backup/BackupProvider";
import { toBackupFile } from "@/lib/backup/files";
import type { ScheduleFreq } from "@/lib/backup/types";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const FREQS: { value: ScheduleFreq; key: string }[] = [
  { value: "daily", key: "backup.scheduleDaily" },
  { value: "weekly", key: "backup.scheduleWeekly" },
  { value: "off", key: "backup.scheduleOff" },
];

export default function BackupPage() {
  const { t } = useI18n();
  const { state, setSchedule, addFiles, runBackup, busy } = useBackup();
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addFiles(Array.from(files).map(toBackupFile));
    e.target.value = "";
  }

  const pending = state.files.filter((f) => f.status === "pending").length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <GhostMascot size={56} state="idle" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("backup.title")}</h1>
          <p className="text-sm text-white/50">{t("backup.subtitle")}</p>
        </div>
      </div>

      <Card className="mb-4">
        <p className="mb-2 text-sm font-medium text-white/70">
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
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-white/50">{t("backup.lastBackup")}</p>
            <p className="font-semibold">
              {state.lastBackupAt
                ? new Date(state.lastBackupAt).toLocaleString()
                : t("backup.never")}
            </p>
          </div>
          <div>
            <p className="text-white/50">{t("backup.nextBackup")}</p>
            <p className="font-semibold">
              {state.nextBackupAt
                ? new Date(state.nextBackupAt).toLocaleString()
                : t("backup.never")}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button onClick={runBackup} disabled={busy}>
            <HardDriveUpload size={16} />
            {busy ? t("backup.backingUp") : t("backup.backUpNow")}
          </Button>
          {pending > 0 && (
            <p className="mt-2 text-xs text-white/50">
              {t("backup.fileCount", { count: pending })} · pending
            </p>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt"
            onChange={onPick}
            className="hidden"
          />
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            <Upload size={16} />
            {t("backup.addFiles")}
          </Button>
        </div>
      </Card>

      <Card>
        {state.files.length === 0 ? (
          <p className="text-sm text-white/50">{t("backup.empty")}</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {state.files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="truncate">{f.name}</span>
                <span
                  className={
                    f.status === "backed-up"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                >
                  {f.status === "backed-up" ? t("common.now") : "pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
