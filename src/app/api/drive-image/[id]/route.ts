import { google } from "googleapis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const getEnv = (key: string) => process.env[key] ?? "";

const createDriveClient = () => {
  const clientEmail = getEnv("GOOGLE_DRIVE_CLIENT_EMAIL");
  const privateKey = getEnv("GOOGLE_DRIVE_PRIVATE_KEY").replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"]
  });

  return google.drive({ version: "v3", auth });
};

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const drive = createDriveClient();
  if (!drive) {
    return NextResponse.json(
      { error: "Missing Google Drive credentials." },
      { status: 500 }
    );
  }

  const fileId = context.params.id;
  if (!fileId) {
    return NextResponse.json({ error: "Missing file id." }, { status: 400 });
  }

  try {
    const metaRes = await drive.files.get({
      fileId,
      fields: "mimeType"
    });

    const fileRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );

    const mimeType = metaRes.data.mimeType ?? "application/octet-stream";

    return new NextResponse(Buffer.from(fileRes.data as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, immutable"
      }
    });
  } catch (error) {
    console.error("[Drive] Failed to fetch file", error);
    return NextResponse.json({ error: "Failed to fetch file." }, { status: 500 });
  }
}
