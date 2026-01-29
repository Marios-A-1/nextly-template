import { NextRequest, NextResponse } from "next/server";
import { getDriveFolderImagesPage } from "@/src/lib/googleDrive";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "50");
  const pageToken = searchParams.get("pageToken") ?? undefined;

  const pageSize = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50;
  const data = await getDriveFolderImagesPage({ pageToken, pageSize });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60"
    }
  });
}

