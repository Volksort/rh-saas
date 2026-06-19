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
      return Response.json(
        { error: "Datos incompletos" },
        { status: 400 }
      )
    }

    // Obtener empleado con su empresa
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { company: true }
    })

    if (!employee) {
      return Response.json(
        { error: "Empleado no encontrado" },
        { status: 404 }
      )
    }

    // Preparar buffer del archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Definir nombre final del documento
    const finalName = documentType === "OTRO"
      ? (customName || "Documento")
      : documentType

    // Ruta en Supabase Storage
    const filePath = `${employee.company.name}/${employee.name}/${finalName}/${Date.now()}-${file.name}`.trim()

    // Subir a Supabase
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.log(uploadError)
      return Response.json(
        { error: "Error subiendo archivo a Supabase" },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath)

    // ==============================================
    // LÓGICA DE GUARDADO EN PRISMA
    // ==============================================

    if (documentType === "OTRO") {
      // Para OTRO: siempre crear un nuevo registro (múltiples documentos)
      await prisma.document.create({
        data: {
          name: finalName,
          type: documentType,
          uploaded: true,
          driveUrl: urlData.publicUrl,
          fileName: file.name,
          uploadedAt: new Date(),
          employeeId: employee.id
        }
      })
    } else {
      // Para tipos estándar: buscar si ya existe uno del mismo tipo
      const existingDocument = await prisma.document.findFirst({
        where: {
          employeeId,
          type: documentType
        }
      })

      if (existingDocument) {
        // Sobrescribir el existente
        await prisma.document.update({
          where: { id: existingDocument.id },
          data: {
            name: finalName,
            uploaded: true,
            driveUrl: urlData.publicUrl,
            fileName: file.name,
            uploadedAt: new Date()
          }
        })
      } else {
        // Crear nuevo
        await prisma.document.create({
          data: {
            name: finalName,
            type: documentType,
            uploaded: true,
            driveUrl: urlData.publicUrl,
            fileName: file.name,
            uploadedAt: new Date(),
            employeeId: employee.id
          }
        })
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "UPLOAD_DOCUMENT",
        entityType: "DOCUMENT",
        entityId: employee.id,
        description: `Documento ${finalName} subido a ${employee.name}`,
        companyId: employee.companyId,
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}