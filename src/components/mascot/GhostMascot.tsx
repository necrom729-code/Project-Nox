type GhostState = "idle" | "press" | "scroll";

export function GhostMascot({
  size = 96,
  state = "idle",
  className = "",
}: {
  size?: number;
  state?: GhostState;
  className?: string;
}) {
  const stateClass =
    state === "press"
      ? "necrom-ghost-press"
      : state === "scroll"
        ? "necrom-ghost-scroll"
        : "necrom-ghost-idle";

  return (
    <div
      className={`necrom-ghost ${stateClass} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <radialGradient id="ghostBody" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c7d2fe" />
          </radialGradient>
        </defs>
        <path
          d="M50 8
             C28 8 14 26 14 50
             L14 88
             C20 82 26 88 32 82
             C38 76 44 88 50 82
             C56 76 62 88 68 82
             C74 76 80 88 86 82
             L86 50
             C86 26 72 8 50 8 Z"
          fill="url(#ghostBody)"
          stroke="#a5b4fc"
          strokeWidth="1.5"
        />
        <ellipse cx="38" cy="46" rx="6" ry="8" fill="#1e1b4b" />
        <ellipse cx="62" cy="46" rx="6" ry="8" fill="#1e1b4b" />
        <circle cx="40" cy="43" r="2" fill="#ffffff" />
        <circle cx="64" cy="43" r="2" fill="#ffffff" />
        <path
          d="M42 62 Q50 70 58 62"
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="28" cy="58" r="4" fill="#fbcfe8" opacity="0.7" />
        <circle cx="72" cy="58" r="4" fill="#fbcfe8" opacity="0.7" />
      </svg>
    </div>
  );
}
