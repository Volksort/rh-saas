import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Obtener el documento con datos del empleado y empresa
    const doc = await prisma.document.findUnique({
      where: { id },
      include: { employee: { include: { company: true } } }
    });

    if (!doc) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    // Eliminar archivo físico de Supabase (opcional pero recomendado)
    if (doc.driveUrl) {
      // Extraer la ruta relativa desde la URL pública
      const url = new URL(doc.driveUrl);
      const pathParts = url.pathname.split('/');
      // El bucket es 'documents', entonces la ruta está después de '/documents/'
      const bucketPath = pathParts.slice(pathParts.indexOf('documents') + 1).join('/');
      if (bucketPath) {
        const { error } = await supabase.storage.from('documents').remove([bucketPath]);
        if (error) console.error('Error eliminando archivo de Supabase:', error);
      }
    }

    // Eliminar registro de la base de datos
    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}