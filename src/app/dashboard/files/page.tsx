"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Music,
  Trash2,
  Video,
  FolderOpen,
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
};

const KIND_KEY: Record<MediaKind, string> = {
  document: "media.document",
  photo: "media.photo",
  video: "media.video",
  audio: "media.audio",
};

const ORDER: MediaKind[] = ["photo", "video", "audio", "document"];

export default function FilesPage() {
  const { t } = useI18n();
  const { state, removeFile } = useBackup();
  const [selected, setSelected] = useState<BackupFile | null>(null);

  const backedUp = state.files.filter((f) => f.status === "backed-up");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <GhostMascot size={56} state="idle" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("media.title")}</h1>
          <p className="text-sm text-white/50">{t("media.subtitle")}</p>
        </div>
      </div>

      {backedUp.length === 0 ? (
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
                <Icon size={16} /> {t(KIND_KEY[kind])}
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
