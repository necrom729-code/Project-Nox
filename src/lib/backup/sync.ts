import type { BackupFile, BackupState } from "./types";
import { defaultState, loadBackup, saveBackup } from "./store";

/**
 * Cross-device sync. The default `cloudSync` talks to the Next.js server
 * (API routes under /api/backup and /api/files), so the SAME account email on a
 * PC and a Smartphone share one backup: files are uploaded to the server and
 * the metadata is stored server-side keyed by email. If the server is
 * unreachable (e.g. a proxy/gateway that blocks /api/*, or offline), it fails
 * fast and transparently falls back to per-account localStorage so the app
 * keeps working locally.
 *
 * `getSyncSource()` reports where the last operation actually landed
 * ("cloud" | "local"), which the UI shows so the user understands sync state.
 */

const BACKUP_API = "/api/backup";
const FILES_API = "/api/files";
const TIMEOUT_MS = 5000;

export type SyncSource = "cloud" | "local";
let lastSource: SyncSource = "local";
export function getSyncSource(): SyncSource {
  return lastSource;
}

async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function serverLoad(email: string): Promise<BackupState> {
  const res = await fetchWithTimeout(
    `${BACKUP_API}?email=${encodeURIComponent(email)}`,
  );
  if (!res.ok) throw new Error("load failed");
  return (await res.json()) as BackupState;
}

async function serverSave(email: string, state: BackupState): Promise<void> {
  const res = await fetchWithTimeout(
    `${BACKUP_API}?email=${encodeURIComponent(email)}`,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) },
  );
  if (!res.ok) throw new Error("save failed");
}

async function serverUpload(file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetchWithTimeout(FILES_API, { method: "POST", body: fd });
  if (!res.ok) throw new Error("upload failed");
  return (await res.json()) as { url: string };
}

function localUrl(file: File): string {
  if (typeof URL !== "undefined" && "createObjectURL" in URL) {
    return URL.createObjectURL(file);
  }
  return "";
}

export const cloudSync = {
  async load(email: string | null): Promise<BackupState> {
    if (email) {
      try {
        const state = await serverLoad(email);
        lastSource = "cloud";
        return state;
      } catch {
        // fall through to local
      }
    }
    lastSource = "local";
    return loadBackup(email);
  },

  async save(email: string | null, state: BackupState): Promise<void> {
    if (email) {
      try {
        await serverSave(email, state);
        lastSource = "cloud";
        return;
      } catch {
        // fall through to local
      }
    }
    lastSource = "local";
    saveBackup(state, email);
  },

  // Upload a file; returns a URL usable from any device on this origin.
  async uploadFile(file: File): Promise<string> {
    try {
      const { url } = await serverUpload(file);
      lastSource = "cloud";
      return url;
    } catch {
      lastSource = "local";
      return localUrl(file);
    }
  },
};

export type { BackupFile };
