"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function VacationsDashboard() {
  const [vacations, setVacations] = useState<any[]>([])
  const [employeeId, setEmployeeId] = useState("")

  async function load() {
    const params = new URLSearchParams()

    if (employeeId) {
      params.append("employeeId", employeeId)
    }

    const res = await fetch(`/api/vacations?${params.toString()}`)
    const data = await res.json()

    setVacations(data)
  }

  useEffect(() => {
    load()
  }, [employeeId])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-6">
          Vacaciones / Permisos
        </h1>

        <input
          placeholder="Filtrar por Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        />

        <div className="space-y-3">

          {vacations.map((v) => (
            <div
              key={v.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl flex justify-between"
            >
              <div>
                <p className="font-bold text-white">
                  {v.employee?.name || "Empleado"}
                </p>

                <p className="text-sm text-gray-400">
                  {v.type} · {v.days} días
                </p>

                <p className="text-xs text-gray-500">
                  {v.reason || "Sin motivo"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-300">
                  {v.type}
                </p>

                <Link
                  href={`/dashboard/vacations/${v.employeeId}`}
                  className="text-emerald-500 text-sm"
                >
                  Ver
                </Link>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}