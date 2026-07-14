"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { useBackup } from "@/lib/backup/BackupProvider";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Card } from "@/components/ui/Card";

export default function DashboardOverview() {
  const { t } = useI18n();
  const { state } = useBackup();
  const backedUp = state.files.filter((f) => f.status === "backed-up").length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <GhostMascot size={64} state="idle" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("dashboard.overview.title")}
          </h1>
          <p className="text-sm text-white/50">
            {t("dashboard.overview.subtitle")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-white/50">
            {t("dashboard.overview.totalBackedUp")}
          </p>
          <p className="mt-2 text-3xl font-black">{backedUp}</p>
        </Card>
        <Card>
          <p className="text-sm text-white/50">
            {t("dashboard.overview.lastBackup")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {state.lastBackupAt
              ? new Date(state.lastBackupAt).toLocaleString()
              : t("dashboard.overview.never")}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-white/50">
            {t("dashboard.overview.nextBackup")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {state.nextBackupAt
              ? new Date(state.nextBackupAt).toLocaleString()
              : t("dashboard.overview.never")}
          </p>
        </Card>
      </div>
    </div>
  );
}
