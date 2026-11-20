import { getResultsPage } from "@/lib/results";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "24");
  const offset = Number(searchParams.get("offset") ?? "0");
  const page = await getResultsPage(
    Number.isInteger(offset) ? Math.max(0, offset) : 0,
    Number.isInteger(limit) ? Math.min(Math.max(1, limit), 200) : 24,
  );

  return Response.json(page, { headers: { "Cache-Control": "public, max-age=60" } });
}
