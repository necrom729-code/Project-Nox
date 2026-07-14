export type MediaKind = "document" | "photo" | "video" | "audio";

export type BackupFile = {
  id: string;
  name: string;
  kind: MediaKind;
  size: number;
  addedAt: number;
  status: "backed-up" | "pending";
  url?: string;
};

export type ScheduleFreq = "daily" | "weekly" | "off";

export type BackupState = {
  schedule: ScheduleFreq;
  lastBackupAt: number | null;
  nextBackupAt: number | null;
  files: BackupFile[];
};
