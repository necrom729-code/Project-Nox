"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Music,
  Trash2,
  Video,
  FolderOpen,
  Mic,
  Package,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useBackup } from "@/lib/backup/BackupProvider";
import type { BackupFile, MediaKind } from "@/lib/backup/types";
import { GhostMascot } from "@/components/mascot/GhostMascot";
import { Card } from "@/components/ui/Card";
import { MediaModal } from "@/components/media/MediaModal";

const KIND_ICON: Record<MediaKind, typeof ImageIcon> = {
  document: FileText,
  photo: ImageIcon,
  video: Video,
  audio: Music,
  voice: Mic,
  other: Package,
};

const KIND_KEY: Record<MediaKind, string> = {
  document: "media.document",
  photo: "media.photo",
  video: "media.video",
  audio: "media.audio",
  voice: "media.voice",
  other: "media.other",
};

const ORDER: MediaKind[] = ["photo", "video", "audio", "voice", "document", "other"];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function FilesPage() {
  const { t } = useI18n();
  const { state, removeFile, busy } = useBackup();
  const [selected, setSelected] = useState<BackupFile | null>(null);

  const backedUp = state.files.filter((f) => f.status === "backed-up");
  const uploading = state.files.filter((f) => f.status === "uploading");
  const failed = state.files.filter((f) => f.status === "failed");

  const quotaPct = state.storageLimit
    ? Math.min(100, (state.storageUsed / state.storageLimit) * 100)
    : 0;
  const nearQuota = quotaPct >= 80;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <GhostMascot size={56} state="idle" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{t("media.title")}</h1>
          <p className="text-sm text-white/50">{t("media.subtitle")}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all ${nearQuota ? "bg-rose-500" : "bg-indigo-500"}`}
                style={{ width: `${quotaPct}%` }}
              />
            </div>
            <span className="text-xs text-white/50">
              {formatBytes(state.storageUsed)} / {formatBytes(state.storageLimit)}
            </span>
            {nearQuota && (
              <span className="flex items-center gap-1 text-xs text-rose-300">
                <AlertTriangle size={12} /> {t("backup.quotaNear")}
              </span>
            )}
          </div>
        </div>
      </div>

      {busy && uploading.length > 0 && (
        <Card className="mb-4 flex items-center gap-3 border-indigo-500/30 bg-indigo-500/5">
          <Loader2 size={20} className="animate-spin text-indigo-300" />
          <span className="text-sm text-white/70">
            {t("backup.backingUp")} ({uploading.length})
          </span>
        </Card>
      )}

      {failed.length > 0 && (
        <Card className="mb-4 flex items-center gap-3 border-rose-500/30 bg-rose-500/5">
          <AlertTriangle size={20} className="text-rose-300" />
          <span className="text-sm text-rose-300">
            {failed.length} {t("backup.failedFiles")}
          </span>
        </Card>
      )}

      {backedUp.length === 0 && uploading.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-10 text-center">
          <FolderOpen size={36} className="text-white/40" />
          <p className="text-sm text-white/50">{t("backup.empty")}</p>
        </Card>
      ) : (
        ORDER.map((kind) => {
          const items = backedUp.filter((f) => f.kind === kind);
          if (items.length === 0) return null;
          const Icon = KIND_ICON[kind];
          return (
            <div key={kind} className="mb-6">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Icon size={16} /> {t(KIND_KEY[kind])} ({items.length})
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((f) => (
                  <div key={f.id} className="group relative">
                    <button
                      onClick={() => setSelected(f)}
                      className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-colors hover:bg-white/10"
                    >
                      <Icon size={32} className="text-indigo-300" />
                      <span className="line-clamp-2 break-all text-xs text-white/80">
                        {f.name}
                      </span>
                    </button>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="absolute right-2 top-2 rounded-full bg-rose-500/20 p-1.5 text-rose-300 opacity-0 transition-opacity hover:bg-rose-500/30 group-hover:opacity-100"
                      aria-label={t("deleteFile")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {selected && (
        <MediaModal
          file={selected}
          index={backedUp.findIndex((f) => f.id === selected.id)}
          total={backedUp.length}
          onNavigate={(i) => setSelected(backedUp[i])}
          onDelete={removeFile}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}