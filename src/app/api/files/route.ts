import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = join(process.cwd(), "uploads");
const META_DIR = join(UPLOAD_DIR, "meta");

function safeName(n: string): string {
  return (n || "file").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  const id = randomUUID();
  const name = safeName(file.name);
  const type = file.type || "application/octet-stream";
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIR, { recursive: true });
  await mkdir(META_DIR, { recursive: true });
  await writeFile(join(UPLOAD_DIR, id), bytes);
  await writeFile(
    join(META_DIR, `${id}.json`),
    JSON.stringify({ name, type }),
  );

  return NextResponse.json({ url: `/api/files/${id}`, id, name, type });
}
