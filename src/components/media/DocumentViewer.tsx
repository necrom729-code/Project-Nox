"use client";

import { FileText } from "lucide-react";

export function DocumentViewer({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const isPdf = name.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    return (
      <iframe
        src={url}
        title={name}
        className="h-full w-full rounded-xl bg-white"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl bg-white/5 p-6 text-center">
      <FileText size={48} className="text-indigo-300" />
      <p className="text-sm text-white/70">{name}</p>
      <a
        href={url}
        download={name}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Download
      </a>
    </div>
  );
}
