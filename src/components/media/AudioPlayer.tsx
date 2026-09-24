"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SKIP_DEFAULT = 5;

export function AudioPlayer({
  url,
  name,
  skipSeconds = SKIP_DEFAULT,
  duration: externalDuration,
}: {
  url: string;
  name: string;
  skipSeconds?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(externalDuration || 0);
  const [buffering, setBuffering] = useState(false);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }

  function skip(delta: number) {
    const el = ref.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || externalDuration || 0, el.currentTime + delta));
  }

  function seek(v: number) {
    const el = ref.current;
    if (!el) return;
    el.currentTime = v;
    setTime(v);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || externalDuration || 0);
    const onPlay = () => { setPlaying(true); setBuffering(false); };
    const onPause = () => setPlaying(false);
    const onWait = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("waiting", onWait);
    el.addEventListener("playing", onPlaying);
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.code === "ArrowLeft") { e.preventDefault(); skip(-skipSeconds); }
      else if (e.code === "ArrowRight") { e.preventDefault(); skip(skipSeconds); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("waiting", onWait);
      el.removeEventListener("playing", onPlaying);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSeconds, externalDuration]);

  return (
    <div className="w-full max-w-xl rounded-xl bg-white/5 p-4">
      <audio ref={ref} src={url} preload="metadata" />
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => skip(-skipSeconds)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="skip backward"
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
          aria-label={playing ? "pause" : "play"}
        >
          {playing ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button
          onClick={() => skip(skipSeconds)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="skip forward"
        >
          <SkipForward size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-xs text-white/50">
            {fmt(time)} / {fmt(duration)}
          </p>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={time}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full accent-indigo-500"
        aria-label="seek"
      />
      <p className="mt-2 text-center text-xs text-white/40">
        ←/→ skip {skipSeconds}s · Space play/pause
      </p>
    </div>
  );
}