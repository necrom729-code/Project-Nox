import type { BackupState } from "./types";
import { loadBackup, saveBackup } from "./store";

/**
 * BackupSync is the "cloud" boundary for a user's backup.
 *
 * The default `localAccountSync` keeps each account's backup in
 * per-account localStorage, so the same email always maps to the same files
 * within a browser/device and across logins. This is the correct data model
 * for "same account ⇒ same backup".
 *
 * True cross-device sync (PC ⇄ Smartphone) requires a shared backend. To enable
 * it, implement this same interface against Firebase, e.g.:
 *   - Auth (the logged-in user's uid/email as the account key)
 *   - Cloud Storage for the actual file bytes (blob URLs are device-local and
 *     cannot travel between devices)
 *   - Firestore for the BackupState metadata (files, schedule, timestamps)
 * then export it as `cloudSync` and use it in BackupProvider instead.
 */
export interface BackupSync {
  load: (email: string | null) => BackupState;
  save: (email: string | null, state: BackupState) => void;
}

export const localAccountSync: BackupSync = {
  load: (email) => loadBackup(email),
  save: (email, state) => saveBackup(state, email),
};
