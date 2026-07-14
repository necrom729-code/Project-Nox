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
import {
  computeNext,
  loadBackup,
  saveBackup,
} from "@/lib/backup/store";
import type { BackupFile, BackupState, ScheduleFreq } from "@/lib/backup/types";
import { ensureNotificationPermission, notify } from "@/lib/notifications";

type BackupValue = {
  state: BackupState;
  setSchedule: (freq: ScheduleFreq) => void;
  addFiles: (files: BackupFile[]) => void;
  runBackup: () => Promise<void>;
  busy: boolean;
};

const BackupContext = createContext<BackupValue | null>(null);

export function BackupProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [state, setState] = useState<BackupState>(loadBackup);
  const [busy, setBusy] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const persist = useCallback((next: BackupState) => {
    setState(next);
    saveBackup(next);
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
    (files: BackupFile[]) => {
      persist({ ...stateRef.current, files: [...stateRef.current.files, ...files] });
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

  const value = useMemo<BackupValue>(
    () => ({ state, setSchedule, addFiles, runBackup, busy }),
    [state, setSchedule, addFiles, runBackup, busy],
  );

  return <BackupContext.Provider value={value}>{children}</BackupContext.Provider>;
}

export function useBackup(): BackupValue {
  const ctx = useContext(BackupContext);
  if (!ctx) throw new Error("useBackup must be used within BackupProvider");
  return ctx;
}
