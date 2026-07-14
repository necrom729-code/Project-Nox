import type { BackupFile, BackupState } from "./types";
import { defaultState, loadBackup, saveBackup } from "./store";

/**
 * Cross-device sync. The default `cloudSync` talks to the Next.js server
 * (API routes under /api/backup and /api/files), so the SAME account email on a
 * PC and a Smartphone share one backup: files are uploaded to the server and
 * the metadata is stored server-side keyed by email. If the server is
 * unreachable it transparently falls back to per-account localStorage.
 */

const BACKUP_API = "/api/backup";
const FILES_API = "/api/files";

async function serverLoad(email: string): Promise<BackupState> {
  const res = await fetch(`${BACKUP_API}?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("load failed");
  return (await res.json()) as BackupState;
}

async function serverSave(email: string, state: BackupState): Promise<void> {
  const res = await fetch(`${BACKUP_API}?email=${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error("save failed");
}

async function serverUpload(file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(FILES_API, { method: "POST", body: fd });
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
        return await serverLoad(email);
      } catch {
        // fall through to local
      }
    }
    return loadBackup(email);
  },

  async save(email: string | null, state: BackupState): Promise<void> {
    if (email) {
      try {
        await serverSave(email, state);
        return;
      } catch {
        // fall through to local
      }
    }
    saveBackup(state, email);
  },

  // Upload a file; returns a URL usable from any device on this origin.
  async uploadFile(file: File): Promise<string> {
    try {
      const { url } = await serverUpload(file);
      return url;
    } catch {
      return localUrl(file);
    }
  },
};

export type { BackupFile };
