import type { BackupFile, MediaKind } from "./types";

export function kindFromType(type: string): MediaKind {
  if (type.startsWith("image/")) return "photo";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "document";
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

// Build a backup entry that points at a server-hosted URL (cross-device safe),
// rather than a device-local blob: URL.
export function makeBackupFile(file: File, url: string): BackupFile {
  return {
    id: newId(),
    name: file.name,
    kind: kindFromType(file.type || ""),
    size: file.size,
    addedAt: Date.now(),
    status: "pending",
    url,
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
