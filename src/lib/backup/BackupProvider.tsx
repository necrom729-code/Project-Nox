"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { computeNext, defaultState } from "@/lib/backup/store";
import { cloudSync as sync, getSyncSource, type SyncSource } from "@/lib/backup/sync";
import { makeBackupFile } from "@/lib/backup/files";
import type { BackupFile, BackupState, ScheduleFreq } from "@/lib/backup/types";
import { ensureNotificationPermission, notify } from "@/lib/notifications";

type BackupValue = {
  state: BackupState;
  setSchedule: (freq: ScheduleFreq) => void;
  addFiles: (files: File[]) => Promise<void>;
  runBackup: () => Promise<void>;
  removeFile: (id: string) => void;
  busy: boolean;
  syncSource: SyncSource;
};

const BackupContext = createContext<BackupValue | null>(null);

export function BackupProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const email = user?.email ?? null;

  const [state, setState] = useState<BackupState>(defaultState);
  const [busy, setBusy] = useState(false);
  const [syncSource, setSyncSource] = useState<SyncSource>("local");
  const stateRef = useRef(state);
  stateRef.current = state;
  const emailRef = useRef(email);
  emailRef.current = email;

  // Load this account's backup from the server whenever the logged-in account
  // changes. Same email on PC and Smartphone ⇒ same files.
  useEffect(() => {
    let cancelled = false;
    sync.load(email).then((s) => {
      if (!cancelled) {
        setState(s);
        setSyncSource(getSyncSource());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [email]);

  const persist = useCallback((next: BackupState) => {
    setState(next);
    void sync.save(emailRef.current, next).then(() =>
      setSyncSource(getSyncSource()),
    );
  }, []);

  const setSchedule = useCallback(
    (freq: ScheduleFreq) => {
      const next: BackupState = {
        ...stateRef.current,
        schedule: freq,
        nextBackupAt: computeNext(freq),
      };
      persist(next);
    },
    [persist],
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setBusy(true);
      try {
        const uploaded = await Promise.all(
          files.map(async (f) => {
            const url = await sync.uploadFile(f);
            return makeBackupFile(f, url);
          }),
        );
        persist({
          ...stateRef.current,
          files: [...stateRef.current.files, ...uploaded],
        });
      } finally {
        setBusy(false);
      }
    },
    [persist],
  );

  const runBackup = useCallback(async () => {
    setBusy(true);
    await ensureNotificationPermission();
    notify(t("notifications.start"), t("notifications.startBody"));
    await new Promise((r) => setTimeout(r, 900));
    try {
      const now = Date.now();
      const prev = stateRef.current;
      const files = prev.files.map((f) =>
        f.status === "pending" ? { ...f, status: "backed-up" as const } : f,
      );
      const next: BackupState = {
        ...prev,
        files,
        lastBackupAt: now,
        nextBackupAt: computeNext(prev.schedule, now),
      };
      persist(next);
      const count = files.length;
      notify(
        t("notifications.success"),
        t("notifications.successBody", { count }),
      );
    } catch {
      notify(t("notifications.failure"), t("notifications.failureBody"));
    } finally {
      setBusy(false);
    }
  }, [persist, t]);

  // Scheduler: trigger when nextBackupAt passes. Runs every 30s.
  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      if (s.schedule !== "off" && s.nextBackupAt && Date.now() >= s.nextBackupAt) {
        void runBackup();
      }
    };
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [runBackup]);

  const removeFile = useCallback((id: string) => {
    const prev = stateRef.current;
    const target = prev.files.find((f) => f.id === id);
    if (target?.url && typeof URL !== "undefined" && "revokeObjectURL" in URL) {
      URL.revokeObjectURL(target.url);
    }
    persist({ ...prev, files: prev.files.filter((f) => f.id !== id) });
  }, [persist]);

  const value = useMemo<BackupValue>(
    () => ({ state, setSchedule, addFiles, runBackup, removeFile, busy, syncSource }),
    [state, setSchedule, addFiles, runBackup, removeFile, busy, syncSource],
  );

  return <BackupContext.Provider value={value}>{children}</BackupContext.Provider>;
}

export function useBackup(): BackupValue {
  const ctx = useContext(BackupContext);
  if (!ctx) throw new Error("useBackup must be used within BackupProvider");
  return ctx;
}
