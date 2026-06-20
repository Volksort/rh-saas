"use client"

import { useState } from "react"

export default function AddVacationModal({
  employeeId,
}: {
  employeeId: string
}) {
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState(0)
  const [type, setType] = useState("TAKEN")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!days) return

    setLoading(true)

    await fetch("/api/vacations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId,
        days,
        type,
        reason,
      }),
    })

    setLoading(false)
    setOpen(false)
    location.reload()
  }

  return (
    <>
      {/* BOTÓN */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        + Registrar vacaciones
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Registrar vacaciones
            </h2>

            {/* DÍAS */}
            <input
              type="number"
              placeholder="Días"
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-3"
              onChange={(e) => setDays(Number(e.target.value))}
            />


            {/* TIPO */}
            <select
              value={type}
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-3"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="EARNED">Ganados</option>
              <option value="TAKEN">Tomados</option>
              <option value="ADVANCE">Adelanto</option>
              <option value="ADJUSTMENT">Ajuste</option>
            </select>

            {/* MOTIVO */}
            <input
              placeholder="Motivo"
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded mb-4"
              onChange={(e) => setReason(e.target.value)}
            />

            {/* BOTONES */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>

              <button
                onClick={save}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}