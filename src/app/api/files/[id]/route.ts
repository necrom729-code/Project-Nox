import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = join(process.cwd(), "uploads");
const META_DIR = join(UPLOAD_DIR, "meta");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return new NextResponse("bad id", { status: 400 });
  }
  const metaPath = join(META_DIR, `${id}.json`);
  if (!existsSync(metaPath)) {
    return new NextResponse("not found", { status: 404 });
  }
  const meta = JSON.parse(await readFile(metaPath, "utf8")) as {
    name: string;
    type: string;
  };
  const data = await readFile(join(UPLOAD_DIR, id));
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": meta.type || "application/octet-stream",
      "Content-Disposition": `inline; filename="${meta.name}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
