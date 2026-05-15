"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateDepartmentModal({
  companyId
}: {
  companyId: string
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const createDepartment = async () => {
    if (!name) return
    setLoading(true)

    await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, companyId })
    })

    setLoading(false)
    setName("")
    setOpen(false)
    router.refresh() // mejor que location.reload()
  }

  return (
    <>
      {/* BOTÓN ABRIR MODAL */}
      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded transition-colors"
      >
        Crear departamento
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Nuevo departamento
            </h2>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              placeholder="Nombre del departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={createDepartment}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50 transition"
              >
                {loading ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}