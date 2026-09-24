"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SKIP_DEFAULT = 5;

export function VideoPlayer({
  url,
  name,
  skipSeconds = SKIP_DEFAULT,
}: {
  url: string;
  name: string;
  skipSeconds?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + delta));
  }

  function volume(delta: number) {
    const el = ref.current;
    if (!el) return;
    el.volume = Math.max(0, Math.min(1, el.volume + delta));
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
    const onMeta = () => setDuration(el.duration || 0);
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
      if (e.target !== document.body && (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.code === "ArrowLeft") { e.preventDefault(); skip(-skipSeconds); }
      else if (e.code === "ArrowRight") { e.preventDefault(); skip(skipSeconds); }
      else if (e.code === "ArrowUp") { e.preventDefault(); volume(0.1); }
      else if (e.code === "ArrowDown") { e.preventDefault(); volume(-0.1); }
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
  }, [skipSeconds]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-black/40 p-4">
      <div className="relative w-full max-w-4xl">
        <video
          ref={ref}
          src={url}
          controls
          playsInline
          className="max-h-[70vh] w-full rounded-lg"
          aria-label={name}
        />
        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>
      <div className="mt-3 flex w-full max-w-4xl items-center gap-3">
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
        <div className="ml-2 flex-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>{fmt(time)}</span>
            <span>{fmt(duration)}</span>
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
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-white/40">
        ←/→ skip {skipSeconds}s · Space play/pause · ↑/↓ volume
      </p>
    </div>
  );
}