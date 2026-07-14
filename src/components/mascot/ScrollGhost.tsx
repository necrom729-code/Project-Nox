"use client";

import { useEffect, useState } from "react";
import { GhostMascot } from "@/components/mascot/GhostMascot";

export function ScrollGhost() {
  const [progress, setProgress] = useState(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Parallax: drift + rise as the user scrolls; bounce on tap.
  const translateY = -progress * 40;
  const translateX = Math.sin(progress * Math.PI * 2) * 14;

  return (
    <button
      aria-label="NECROM mascot"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="pointer-events-auto fixed bottom-5 right-5 z-40 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      style={{
        transform: `translate(${translateX}px, ${translateY}px) scale(${pressed ? 0.85 : 1})`,
        transition: pressed
          ? "transform 0.12s ease-out"
          : "transform 0.25s ease-out",
      }}
    >
      <GhostMascot size={72} state={pressed ? "press" : "scroll"} />
    </button>
  );
}
