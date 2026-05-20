import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentId = formData.get('documentId') as string
    const employeeId = formData.get('employeeId') as string

    if (!file || !documentId || !employeeId) {
      return Response.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Obtener documento existente
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { employee: { include: { company: true } } }
    })
    if (!doc) return Response.json({ error: 'Documento no existe' }, { status: 404 })

    // Preparar nuevo archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = `${doc.employee.company.name}/${doc.employee.name}/${doc.name}/${Date.now()}-${file.name}`

    // Subir nuevo archivo (sobrescribe o crea nuevo)
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, { upsert: true })

    if (uploadError) {
      return Response.json({ error: 'Error al subir' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)

    // Actualizar registro en Prisma
    await prisma.document.update({
      where: { id: documentId },
      data: {
        driveUrl: urlData.publicUrl,
        fileName: file.name,
        uploadedAt: new Date()
      }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}