"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

const typeLabels: Record<string, string> = {
  EARNED: "Ganados",
  TAKEN: "Tomados",
  ADVANCE: "Adelanto",
  ADJUSTMENT: "Ajuste",
}

export default function VacationsDashboard() {
  const [vacations, setVacations] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)

    const res = await fetch("/api/vacations")
    const data = await res.json()

    setVacations(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const employeesSummary = useMemo(() => {
    const grouped: Record<string, any> = {}

    vacations.forEach((v) => {
      const employeeId = v.employeeId
      const employeeName = v.employee?.name || "Empleado sin nombre"

      if (!grouped[employeeId]) {
        grouped[employeeId] = {
          employeeId,
          employeeName,
          employeePosition: v.employee?.position || "Sin puesto",
          movements: [],
          earned: 0,
          taken: 0,
          advance: 0,
          adjustment: 0,
          lastMovement: null,
        }
      }

      grouped[employeeId].movements.push(v)

      if (v.type === "EARNED") grouped[employeeId].earned += v.days
      if (v.type === "TAKEN") grouped[employeeId].taken += v.days
      if (v.type === "ADVANCE") grouped[employeeId].advance += v.days
      if (v.type === "ADJUSTMENT") grouped[employeeId].adjustment += v.days

      if (
        !grouped[employeeId].lastMovement ||
        new Date(v.createdAt).getTime() >
          new Date(grouped[employeeId].lastMovement.createdAt).getTime()
      ) {
        grouped[employeeId].lastMovement = v
      }
    })

    return Object.values(grouped)
      .map((employee: any) => ({
        ...employee,
        balance:
          employee.earned -
          employee.taken -
          employee.advance +
          employee.adjustment,
      }))
      .filter((employee: any) =>
        employee.employeeName.toLowerCase().includes(search.toLowerCase())
      )
  }, [vacations, search])

  const totalEmployees = employeesSummary.length

  const totalAvailable = employeesSummary.reduce(
    (total: number, employee: any) => total + employee.balance,
    0
  )

  const totalTaken = employeesSummary.reduce(
    (total: number, employee: any) => total + employee.taken,
    0
  )

  const employeesWithNegativeBalance = employeesSummary.filter(
    (employee: any) => employee.balance < 0
  ).length

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vacaciones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Resumen general de vacaciones por empleado
          </p>
        </div>

        {/* CARDS RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Empleados con movimientos
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalEmployees}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Días disponibles
            </p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {totalAvailable}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Días tomados
            </p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {totalTaken}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Saldos negativos
            </p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {employeesWithNegativeBalance}
            </p>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow mb-6">
          <input
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          />
        </div>

        {/* LISTADO */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-500">
            Cargando vacaciones...
          </div>
        ) : employeesSummary.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-500">
            No hay movimientos de vacaciones registrados.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {employeesSummary.map((employee: any) => {
              const last = employee.lastMovement

              return (
                <div
                  key={employee.employeeId}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {employee.employeeName}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {employee.employeePosition}
                      </p>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        employee.balance < 0
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                      }`}
                    >
                      Saldo: {employee.balance}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-5 text-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ganados
                      </p>
                      <p className="font-bold text-emerald-600">
                        {employee.earned}
                      </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tomados
                      </p>
                      <p className="font-bold text-red-500">
                        {employee.taken}
                      </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Adelanto
                      </p>
                      <p className="font-bold text-yellow-500">
                        {employee.advance}
                      </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ajuste
                      </p>
                      <p className="font-bold text-blue-500">
                        {employee.adjustment}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Último movimiento
                    </p>

                    {last ? (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {typeLabels[last.type] || last.type} · {last.days} días
                          </p>
                          <p className="text-xs text-gray-500">
                            {last.reason || "Sin motivo"}
                          </p>
                        </div>

                        <p className="text-xs text-gray-400">
                          {new Date(last.createdAt).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Sin movimientos registrados
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      href={`/dashboard/vacations/${employee.employeeId}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}