"use client";

export function VideoPlayer({ url, name }: { url: string; name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-black/40 p-2">
      <video
        src={url}
        controls
        playsInline
        className="max-h-full max-w-full rounded-lg"
        aria-label={name}
      >
        {name}
      </video>
    </div>
  );
}
