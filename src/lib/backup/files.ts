import type { BackupFile, MediaKind } from "./types";

export function kindFromType(type: string, name: string = ""): MediaKind {
  const n = name.toLowerCase();
  if (type.startsWith("image/")) return "photo";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) {
    // Heuristic: voice memos / recordings often have "voice", "memo", "recording" in name
    if (/(voice|memo|recording|rec|dictation)/i.test(n)) return "voice";
    return "audio";
  }
  if (/(\.pdf|\.doc|\.docx|\.txt|\.rtf|\.odt|\.xls|\.xlsx|\.ppt|\.pptx|\.md|\.csv)$/i.test(n)) return "document";
  return "other";
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

export function makeBackupFile(file: File, url: string): BackupFile {
  return {
    id: newId(),
    name: file.name,
    kind: kindFromType(file.type || "", file.name),
    size: file.size,
    addedAt: Date.now(),
    status: "pending",
    url,
  };
}

export function makeVoiceFile(blob: Blob, name: string, url: string, duration: number): BackupFile {
  return {
    id: newId(),
    name,
    kind: "voice",
    size: blob.size,
    addedAt: Date.now(),
    status: "pending",
    url,
    duration,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}