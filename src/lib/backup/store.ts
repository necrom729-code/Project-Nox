import type { BackupState, ScheduleFreq } from "./types";

const STORAGE_KEY = "necrom.backup";

const DAY = 24 * 60 * 60 * 1000;

export function computeNext(freq: ScheduleFreq, from = Date.now()): number | null {
  if (freq === "off") return null;
  const delta = freq === "daily" ? DAY : DAY * 7;
  return from + delta;
}

export function loadBackup(): BackupState {
  if (typeof window === "undefined") {
    return { schedule: "daily", lastBackupAt: null, nextBackupAt: null, files: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BackupState;
  } catch {
    // ignore
  }
  return {
    schedule: "daily",
    lastBackupAt: null,
    nextBackupAt: computeNext("daily"),
    files: [],
  };
}

export function saveBackup(state: BackupState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
