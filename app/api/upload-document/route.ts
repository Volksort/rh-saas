import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { drive } from "@/lib/google"

import streamifier from "streamifier"

export async function POST(req: NextRequest) {

  const formData = await req.formData()

  const file = formData.get("file") as File
  const employeeId = formData.get("employeeId") as string

  if (!file || !employeeId) {

    return Response.json(
      { error: "Datos incompletos" },
      { status: 400 }
    )

  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  })

  if (!employee?.driveFolderId) {

    return Response.json(
      { error: "Empleado sin carpeta Drive" },
      { status: 400 }
    )

  }

  const bytes = await file.arrayBuffer()

  const buffer = Buffer.from(bytes)

  const uploaded = await drive.files.create({

  requestBody: {
    name: file.name,
    parents: [employee.driveFolderId]
  },

  media: {
    mimeType: file.type,
    body: streamifier.createReadStream(buffer)
  },

  fields: "id,name,webViewLink"

})


// HACER EL ARCHIVO PÚBLICO

await drive.permissions.create({

  fileId: uploaded.data.id!,

  requestBody: {
    role: "reader",
    type: "anyone"
  }

})


// GUARDAR EN DB

await prisma.document.create({

  data: {
    name: file.name,
    driveUrl: uploaded.data.webViewLink!,
    driveFileId: uploaded.data.id!,
    type: "GENERAL",
    employeeId: employee.id
  }

})

  return Response.json({
    success: true
  })

}