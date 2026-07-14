"use client";

import { useState } from "react";
import { Download, History } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useBackup } from "@/lib/backup/BackupProvider";
import { notify } from "@/lib/notifications";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RestorePage() {
  const { t } = useI18n();
  const { state } = useBackup();
  const [restored, setRestored] = useState<string | null>(null);

  const backedUp = state.files.filter((f) => f.status === "backed-up");

  function restore(name: string, url?: string) {
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    }
    setRestored(name);
    notify(t("restore.title"), t("restore.done", { name }));
    setTimeout(() => setRestored(null), 2500);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <GhostMascot size={56} state="idle" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("restore.title")}
          </h1>
          <p className="text-sm text-white/50">{t("restore.subtitle")}</p>
        </div>
      </div>

      <Card>
        {backedUp.length === 0 ? (
          <p className="text-sm text-white/50">{t("restore.empty")}</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {backedUp.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <History size={16} className="shrink-0 text-indigo-300" />
                  <span className="truncate text-sm">{f.name}</span>
                </span>
                <Button
                  variant="secondary"
                  onClick={() => restore(f.name, f.url)}
                >
                  <Download size={16} />
                  {restored === f.name ? t("restore.restored") : t("restore.restore")}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
