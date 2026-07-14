"use client";

import { useState } from "react";

export function ImageViewer({
  url,
  alt,
}: {
  url: string;
  alt: string;
}) {
  const [scale, setScale] = useState(1);

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    setScale((s) => Math.min(5, Math.max(1, s - e.deltaY * 0.002)));
  }

  return (
    <div
      onWheel={onWheel}
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black/40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        draggable={false}
        style={{ transform: `scale(${scale})`, transition: "transform 0.08s" }}
        className="max-h-full max-w-full select-none touch-none"
      />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80">
        {Math.round(scale * 100)}%
      </div>
      <div className="absolute right-3 top-3 flex gap-1">
        <button
          onClick={() => setScale((s) => Math.min(5, s + 0.25))}
          className="h-8 w-8 rounded-full bg-white/15 text-lg leading-none text-white"
          aria-label="zoom in"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(1, s - 0.25))}
          className="h-8 w-8 rounded-full bg-white/15 text-lg leading-none text-white"
          aria-label="zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}
