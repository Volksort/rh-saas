'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeleteDocumentButton({
  documentId,
  employeeId,
}: {
  documentId: string
  employeeId: string
}) {

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleDelete = async () => {

    toast(
      '¿Eliminar documento?',
      {
        description:
          'Esta acción no se puede deshacer.',

        action: {
          label: 'Eliminar',

          onClick: async () => {

            try {

              setLoading(true)

              const res = await fetch(
                `/api/documents/${documentId}`,
                {
                  method: 'DELETE',
                }
              )

              if (!res.ok) {

                throw new Error()

              }

              toast.success(
                'Documento eliminado correctamente'
              )

              router.refresh()

            } catch (error) {

              toast.error(
                'Error al eliminar el documento'
              )

            } finally {

              setLoading(false)

            }

          },
        },
      }
    )

  }

  return (

    <button
      onClick={handleDelete}
      disabled={loading}
      className="
        bg-red-600
        hover:bg-red-700
        text-white
        font-medium
        py-1.5
        px-3
        rounded-lg
        text-sm
        disabled:opacity-50
        transition
      "
    >

      {
        loading
          ? 'Eliminando...'
          : 'Eliminar'
      }

    </button>

  )

}