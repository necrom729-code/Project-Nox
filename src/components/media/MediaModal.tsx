"use client";

import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { BackupFile } from "@/lib/backup/types";
import { ImageViewer } from "./ImageViewer";
import { VideoPlayer } from "./VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";
import { DocumentViewer } from "./DocumentViewer";

export function MediaModal({
  file,
  index,
  total,
  onNavigate,
  onDelete,
  onClose,
}: {
  file: BackupFile;
  index: number;
  total: number;
  onNavigate: (nextIndex: number) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  if (!file.url) return null;

  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-slate-900 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-white/80">
            {file.name}
          </p>
          <span className="shrink-0 text-xs text-white/40">
            {index + 1} / {total}
          </span>
          <button
            onClick={() => {
              onDelete(file.id);
              onClose();
            }}
            className="shrink-0 rounded-full bg-rose-500/20 p-2 text-rose-300 hover:bg-rose-500/30"
            aria-label={t("deleteFile")}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label={t("media.close")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          {file.kind === "photo" && (
            <ImageViewer url={file.url} alt={file.name} />
          )}
          {file.kind === "video" && (
            <VideoPlayer url={file.url} name={file.name} />
          )}
          {(file.kind === "audio" || file.kind === "voice") && (
            <div className="flex h-full items-center justify-center">
              <AudioPlayer
                url={file.url}
                name={file.name}
                duration={file.duration}
              />
            </div>
          )}
          {file.kind === "document" && (
            <DocumentViewer url={file.url} name={file.name} />
          )}
          {file.kind === "other" && (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <PackageIcon />
              <p className="text-white/60">{file.name}</p>
              <a
                href={file.url}
                download={file.name}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
              >
                {t("media.download")}
              </a>
            </div>
          )}

          {canPrev && (
            <button
              onClick={() => onNavigate(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              aria-label="previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {canNext && (
            <button
              onClick={() => onNavigate(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              aria-label="next"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PackageIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-white/40"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}