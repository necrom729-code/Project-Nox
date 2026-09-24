"use client";

import { useRef, useState } from "react";
import {
  HardDriveUpload,
  Trash2,
  Upload,
  Mic,
  Square,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useBackup } from "@/lib/backup/BackupProvider";
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
  const { state, setSchedule, addFiles, removeFile, runBackup, busy } = useBackup();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [quotaPct, setQuotaPct] = useState(0);

  const pending = state.files.filter((f) => f.status === "pending").length;
  const uploading = state.files.filter((f) => f.status === "uploading").length;
  const failed = state.files.filter((f) => f.status === "failed").length;

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addFiles(Array.from(files).map((f) => f as File));
    e.target.value = "";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }
  function onDragLeave() { setDragOver(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).map((f) => f as File);
    if (files.length > 0) addFiles(files);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
        await addFiles([file]);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecorder(mr);
      setRecording(true);
    } catch {
      // mic not available — fall back to file picker
      inputRef.current?.click();
    }
  }
  function stopRecording() {
    recorder?.stop();
    setRecording(false);
  }

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

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`mb-4 rounded-2xl border-2 p-6 text-center transition-colors ${
          dragOver
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-dashed border-white/20 bg-white/5"
        }`}
      >
        <p className="text-sm text-white/70">
          Drag &amp; drop files here, or use the buttons below
        </p>
      </div>

      <Card className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button onClick={runBackup} disabled={busy}>
            <HardDriveUpload size={16} />
            {busy ? t("backup.backingUp") : t("backup.backUpNow")}
          </Button>
          <Button
            variant="secondary"
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? <Square size={16} /> : <Mic size={16} />}
            {recording ? "Stop Recording" : "Record Voice"}
          </Button>
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            <Upload size={16} />
            {t("backup.addFiles")}
          </Button>
        </div>
        <div className="flex gap-3 text-xs">
          {pending > 0 && <span className="text-amber-400">{pending} pending</span>}
          {uploading > 0 && <span className="text-blue-400">{uploading} uploading</span>}
          {failed > 0 && <span className="text-rose-400">{failed} failed</span>}
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
                className="flex items-center justify-between gap-2 py-2 text-sm"
              >
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span
                  className={
                    f.status === "backed-up"
                      ? "text-emerald-400"
                      : f.status === "pending"
                        ? "text-amber-400"
                        : f.status === "uploading"
                          ? "text-blue-400"
                          : "text-rose-400"
                  }
                >
                  {f.status === "backed-up" ? t("common.now") : f.status}
                </span>
                <button
                  onClick={() => removeFile(f.id)}
                  className="rounded-full p-1.5 text-rose-300 hover:bg-rose-500/20"
                  aria-label={t("deleteFile")}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
