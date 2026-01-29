import "server-only";
import { google } from "googleapis";

type DriveImage = {
  id: string;
  name: string;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
};

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

export const getDriveFolderImages = async (): Promise<DriveImage[]> => {
  const folderId = getEnv("GOOGLE_DRIVE_FOLDER_ID");
  const drive = createDriveClient();

  if (!folderId || !drive) {
    console.warn(
      "[Drive] Missing GOOGLE_DRIVE_FOLDER_ID or service account credentials."
    );
    return [];
  }

  const files: DriveImage[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, imageMediaMetadata)",
      orderBy: "createdTime desc",
      pageToken
    });

    const pageFiles = res.data.files ?? [];
    pageFiles.forEach((file) => {
      const metadata = file.imageMediaMetadata ?? {};
      files.push({
        id: file.id ?? "",
        name: file.name ?? "",
        mimeType: file.mimeType,
        width: metadata.width ?? null,
        height: metadata.height ?? null
      });
    });

    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return files.filter((file) => file.id);
};

export const getDriveFolderImagesPage = async ({
  pageToken,
  pageSize
}: {
  pageToken?: string;
  pageSize?: number;
}): Promise<{ items: DriveImage[]; nextPageToken?: string }> => {
  const folderId = getEnv("GOOGLE_DRIVE_FOLDER_ID");
  const drive = createDriveClient();

  if (!folderId || !drive) {
    console.warn(
      "[Drive] Missing GOOGLE_DRIVE_FOLDER_ID or service account credentials."
    );
    return { items: [] };
  }

  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "nextPageToken, files(id, name, mimeType, imageMediaMetadata)",
    orderBy: "createdTime desc",
    pageToken,
    pageSize
  });

  const items =
    res.data.files?.map((file) => {
      const metadata = file.imageMediaMetadata ?? {};
      return {
        id: file.id ?? "",
        name: file.name ?? "",
        mimeType: file.mimeType,
        width: metadata.width ?? null,
        height: metadata.height ?? null
      };
    }) ?? [];

  return {
    items: items.filter((item) => item.id),
    nextPageToken: res.data.nextPageToken ?? undefined
  };
};
