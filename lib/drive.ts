import { drive } from "./google"

export async function createFolder(
  name: string,
  parentFolderId?: string
) {

  const folder = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId
        ? [parentFolderId]
        : undefined
    },
    fields: "id, webViewLink"
  })

    return {
    id: folder.data.id || undefined,
    url: folder.data.webViewLink || undefined
    }
}