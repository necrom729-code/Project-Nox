import type { BackupFile, MediaKind } from "./types";

export function kindFromType(type: string): MediaKind {
  if (type.startsWith("image/")) return "photo";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "document";
}

export function toBackupFile(file: File): BackupFile {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    name: file.name,
    kind: kindFromType(file.type || ""),
    size: file.size,
    addedAt: Date.now(),
    status: "pending",
    url:
      typeof URL !== "undefined" && "createObjectURL" in URL
        ? URL.createObjectURL(file)
        : undefined,
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
