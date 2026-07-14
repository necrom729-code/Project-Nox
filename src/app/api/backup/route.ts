import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "backups.json");

type Store = Record<string, unknown>;

async function readAll(): Promise<Store> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Store;
  } catch {
    return {};
  }
}

async function writeAll(data: Store): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  const all = await readAll();
  const state =
    (all[email] as Record<string, unknown>) ?? {
      schedule: "daily",
      lastBackupAt: null,
      nextBackupAt: null,
      files: [],
    };
  return NextResponse.json(state);
}

export async function PUT(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  const body = await req.json();
  const all = await readAll();
  all[email] = body;
  await writeAll(all);
  return NextResponse.json({ ok: true });
}
