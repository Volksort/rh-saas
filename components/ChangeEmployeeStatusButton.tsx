'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ChangeEmployeeStatusButton({
  employeeId,
  currentStatus,
}: {
  employeeId: string
  currentStatus: string
}) {

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const newStatus =
    currentStatus === 'ACTIVE'
      ? 'INACTIVE'
      : 'ACTIVE'

  const handleChangeStatus = async () => {

    toast(
      currentStatus === 'ACTIVE'
        ? '¿Desactivar empleado?'
        : '¿Activar empleado?',
      {
        description:
          currentStatus === 'ACTIVE'
            ? 'El empleado dejará de aparecer como activo.'
            : 'El empleado volverá a estar activo.',

        action: {

          label:
            currentStatus === 'ACTIVE'
              ? 'Desactivar'
              : 'Activar',

          onClick: async () => {

            try {

              setLoading(true)

              const res = await fetch(
                `/api/employees/${employeeId}/status`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    status: newStatus,
                  }),
                }
              )

              if (!res.ok) {
                throw new Error()
              }

              toast.success(
                currentStatus === 'ACTIVE'
                  ? 'Empleado desactivado correctamente'
                  : 'Empleado activado correctamente'
              )

              router.refresh()

            } catch {

              toast.error(
                'Error al actualizar el estado'
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
    onClick={handleChangeStatus}
    disabled={loading}
    className={`
      inline-flex
      items-center
      gap-2
      px-3
      py-1
      rounded-full
      text-sm
      font-medium
      transition
      disabled:opacity-50
      ${
        currentStatus === "ACTIVE"
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      }
    `}
  >
    {
      loading
        ? "Actualizando..."
        : currentStatus === "ACTIVE"
          ? "🟢 Activo"
          : "🔴 Inactivo"
    }

    <span className="text-xs">
      ▼
    </span>

  </button>
  )

}