export type MediaKind =
  | "document"
  | "photo"
  | "video"
  | "audio"
  | "voice"
  | "other";

export type BackupFile = {
  id: string;
  name: string;
  kind: MediaKind;
  size: number;
  addedAt: number;
  status: "backed-up" | "pending" | "uploading" | "failed";
  url?: string;
  duration?: number; // for audio/voice/voice recordings, in seconds
};

export type ScheduleFreq = "daily" | "weekly" | "off";

export type BackupState = {
  schedule: ScheduleFreq;
  lastBackupAt: number | null;
  nextBackupAt: number | null;
  files: BackupFile[];
  storageUsed: number; // bytes used
  storageLimit: number; // bytes allowed (default 5GB)
};