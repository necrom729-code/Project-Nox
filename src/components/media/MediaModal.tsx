"use client";

import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { BackupFile } from "@/lib/backup/types";
import { ImageViewer } from "./ImageViewer";
import { VideoPlayer } from "./VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";
import { DocumentViewer } from "./DocumentViewer";

export function MediaModal({
  file,
  onClose,
}: {
  file: BackupFile;
  onClose: () => void;
}) {
  const { t } = useI18n();
  if (!file.url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-slate-900 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="truncate text-sm font-medium text-white/80">
            {file.name}
          </p>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label={t("media.close")}
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          {file.kind === "photo" && (
            <ImageViewer key={file.id} url={file.url} alt={file.name} />
          )}
          {file.kind === "video" && (
            <VideoPlayer key={file.id} url={file.url} name={file.name} />
          )}
          {file.kind === "audio" && (
            <div className="flex h-full items-center justify-center">
              <AudioPlayer key={file.id} url={file.url} name={file.name} />
            </div>
          )}
          {file.kind === "document" && (
            <DocumentViewer key={file.id} url={file.url} name={file.name} />
          )}
        </div>
      </div>
    </div>
  );
}
