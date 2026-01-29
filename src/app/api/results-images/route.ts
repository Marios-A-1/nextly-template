import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const RESULTS_DIR = path.join(process.cwd(), "public", "img", "results");
const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const sortFiles = (a: string, b: string) => {
  const aNum = Number.parseInt(a, 10);
  const bNum = Number.parseInt(b, 10);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) {
    return aNum - bNum;
  }
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "24");
  const offset = Number(searchParams.get("offset") ?? "0");

  const pageSize = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 24;
  const start = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  const files = (await readdir(RESULTS_DIR)).filter((file) =>
    VALID_EXT.has(path.extname(file).toLowerCase())
  );

  const sorted = files.sort(sortFiles);
  const page = sorted.slice(start, start + pageSize);

  const items = page.map((file) => ({
    src: `/img/results/${file}`,
    name: file
  }));

  const nextOffset = start + page.length;

  return NextResponse.json(
    {
      items,
      nextOffset: nextOffset < sorted.length ? nextOffset : null,
      total: sorted.length
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60"
      }
    }
  );
}

