import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const employeeId = formData.get("employeeId") as string
    const documentType = formData.get("documentType") as string
    const customName = formData.get("customName") as string

    if (!file || !employeeId || !documentType) {
      return Response.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { company: true }
    })

    if (!employee) {
      return Response.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const finalName = documentType === "OTRO" ? customName : documentType
    const filePath = `${employee.company.name}/${employee.name}/${finalName}/${Date.now()}-${file.name}`.trim()

    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) {
      console.log(error)
      return Response.json({ error: "Error subiendo archivo" }, { status: 500 })
    }

    const { data } = supabase.storage.from("documents").getPublicUrl(filePath)

    // 🔥 Cambio clave: Solo buscar existente si NO es "OTRO"
    let existingDocument = null
    if (documentType !== "OTRO") {
      existingDocument = await prisma.document.findFirst({
        where: {
          employeeId,
          type: documentType
        }
      })
    }

    if (existingDocument) {
      // Actualizar documento existente (para INE, RFC, etc.)
      await prisma.document.update({
        where: { id: existingDocument.id },
        data: {
          uploaded: true,
          driveUrl: data.publicUrl,
          fileName: file.name,
          uploadedAt: new Date()
        }
      })
    } else {
      // Crear nuevo documento (siempre para OTRO, o si no existe para los fijos)
      await prisma.document.create({
        data: {
          name: finalName,
          type: documentType,
          uploaded: true,
          driveUrl: data.publicUrl,
          fileName: file.name,
          uploadedAt: new Date(),
          employeeId: employee.id
        }
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Error interno" }, { status: 500 })
  }
}