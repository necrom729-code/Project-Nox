"use client";

import { useCallback, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Pt = { x: number; y: number };

const MIN = 1;
const MAX = 6;

function clampScale(s: number) {
  return Math.min(MAX, Math.max(MIN, s));
}

export function ImageViewer({ url, alt }: { url: string; alt: string }) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scaleRef = useRef(1);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState<Pt>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const pointers = useRef<Map<number, Pt>>(new Map());
  const drag = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  // Keep the image within the viewport: clamp translation to the overflow.
  const clamp = useCallback((p: Pt, s: number): Pt => {
    const c = containerRef.current;
    const img = imgRef.current;
    if (!c || !img) return p;
    const overX = Math.max(0, img.offsetWidth * s - c.clientWidth) / 2;
    const overY = Math.max(0, img.offsetHeight * s - c.clientHeight) / 2;
    return {
      x: Math.min(overX, Math.max(-overX, p.x)),
      y: Math.min(overY, Math.max(-overY, p.y)),
    };
  }, []);

  const zoomAt = useCallback(
    (nextScale: number, cx: number, cy: number) => {
      const s = clampScale(nextScale);
      const ratio = s / scaleRef.current;
      scaleRef.current = s;
      setScale(s);
      setPos((pp) =>
        clamp({ x: cx - (cx - pp.x) * ratio, y: cy - (cy - pp.y) * ratio }, s),
      );
    },
    [clamp],
  );

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    zoomAt(scaleRef.current - e.deltaY * 0.002, cx, cy);
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: scaleRef.current };
      drag.current = null;
      setDragging(false);
    } else {
      drag.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
      };
      setDragging(true);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const c = containerRef.current!.getBoundingClientRect();
      const midX = (a.x + b.x) / 2 - c.left - c.width / 2;
      const midY = (a.y + b.y) / 2 - c.top - c.height / 2;
      zoomAt(pinch.current.scale * (dist / pinch.current.dist), midX, midY);
      return;
    }

    if (drag.current?.active) {
      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      setPos(clamp({ x: drag.current.origX + dx, y: drag.current.origY + dy }, scaleRef.current));
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      setDragging(false);
    }
  }

  function reset() {
    scaleRef.current = 1;
    setScale(1);
    setPos({ x: 0, y: 0 });
  }

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-full w-full touch-none select-none overflow-hidden rounded-xl bg-black/40"
      style={{ touchAction: "none" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={url}
        alt={alt}
        draggable={false}
        onDoubleClick={reset}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: dragging ? "none" : "transform 0.08s ease-out",
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
        className="max-h-full max-w-full"
      />
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80">
        {Math.round(scale * 100)}%
      </div>
      <div className="absolute right-3 top-3 flex gap-1">
        <button
          onClick={() => zoomAt(scaleRef.current / 1.25, 0, 0)}
          className="h-8 w-8 rounded-full bg-white/15 text-lg leading-none text-white hover:bg-white/25"
          aria-label="zoom out"
        >
          −
        </button>
        <button
          onClick={() => zoomAt(scaleRef.current * 1.25, 0, 0)}
          className="h-8 w-8 rounded-full bg-white/15 text-lg leading-none text-white hover:bg-white/25"
          aria-label="zoom in"
        >
          +
        </button>
        <button
          onClick={reset}
          className="h-8 rounded-full bg-white/15 px-2 text-xs leading-none text-white hover:bg-white/25"
          aria-label="reset"
        >
          ⟳
        </button>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-1 text-[11px] text-white/60">
        {t("media.zoomHint")}
      </div>
    </div>
  );
}
