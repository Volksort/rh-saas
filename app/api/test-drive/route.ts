import { drive } from "@/lib/google"

export async function GET() {

  const res = await drive.files.list({
    pageSize: 10
  })

  return Response.json(res.data)
}