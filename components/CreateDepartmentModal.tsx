"use client"

import { useState } from "react"

export default function CreateDepartmentModal({
  companyId
}: {
  companyId: string
}) {

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const createDepartment = async () => {

    if (!name) return

    setLoading(true)

    await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        companyId
      })
    })

    setLoading(false)
    setName("")
    setOpen(false)

    location.reload()
  }

  return (

    <>

      {/* BOTÓN */}

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Crear departamento
      </button>

      {/* MODAL */}

      {open && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4">
              Nuevo departamento
            </h2>

            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Nombre del departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>

              <button
                onClick={createDepartment}
                disabled={loading}
                className="bg-emerald-600 text-white px-4 py-2 rounded"
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