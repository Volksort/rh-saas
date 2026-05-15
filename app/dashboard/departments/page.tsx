"use client"//out

import { useState, useEffect } from "react"

export default function DepartmentsPage() {
  const [name, setName] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const getSession = async () => {
      const res = await fetch("/api/auth/session")
      const session = await res.json()
      if (session?.user?.companyId) {
        setCompanyId(session.user.companyId)
      }
    }
    getSession()
  }, [])

  const createDepartment = async () => {
    if (!name.trim()) {
      alert("Escribe un nombre")
      return
    }

    setLoading(true)
    setSuccess("")

    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, companyId })
      })

      if (!res.ok) throw new Error("Error al crear")

      setSuccess("¡Departamento creado correctamente!")
      setName("")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      alert("Error al crear el departamento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Crear Departamento
        </h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
          <div className="flex flex-col gap-4">
            <input
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Nombre del departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
            />

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Company ID (automático)
              </label>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg cursor-not-allowed"
                value={companyId}
                disabled
              />
            </div>

            {success && (
              <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-3 rounded-lg text-center">
                {success}
              </div>
            )}

            <button
              onClick={createDepartment}
              disabled={loading || !companyId}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? "Creando..." : "Crear departamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}