import type { BackupState, ScheduleFreq } from "./types";

const DAY = 24 * 60 * 60 * 1000;

export function computeNext(freq: ScheduleFreq, from = Date.now()): number | null {
  if (freq === "off") return null;
  const delta = freq === "daily" ? DAY : DAY * 7;
  return from + delta;
}

// Backups are scoped to the account, not a single global bucket, so the same
// email maps to the same files. "guest" covers the pre-login state.
function keyFor(email?: string | null): string {
  if (!email) return "necrom.backup.guest";
  return `necrom.backup.${encodeURIComponent(email)}`;
}

export function defaultState(): BackupState {
  return {
    schedule: "daily",
    lastBackupAt: null,
    nextBackupAt: computeNext("daily"),
    files: [],
  };
}

export function loadBackup(email?: string | null): BackupState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (raw) return JSON.parse(raw) as BackupState;
  } catch {
    // ignore corrupt data
  }
  return defaultState();
}

export function saveBackup(state: BackupState, email?: string | null): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(keyFor(email), JSON.stringify(state));
}
