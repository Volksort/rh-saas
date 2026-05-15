"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Department = {
  id: string
  name: string
}

export default function CreateEmployeeModal({
  companyId,
  departments
}: {
  companyId: string
  departments: Department[]
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function createEmployee() {
    if (!name || !email || !departmentId) {
      setError("Nombre, email y departamento son obligatorios")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          position,
          companyId,
          departmentId
        })
      })

      if (!res.ok) throw new Error("Error al crear empleado")

      // Limpiar formulario y cerrar modal
      setName("")
      setEmail("")
      setPhone("")
      setPosition("")
      setDepartmentId("")
      setOpen(false)
      router.refresh() // Recarga los datos del servidor sin recargar toda la página
    } catch (err) {
      setError("Error al crear empleado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* BOTÓN ABRIR MODAL */}
      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded transition-colors"
      >
        Crear empleado
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Nuevo empleado
            </h2>

            <div className="flex flex-col gap-4">
              <input
                placeholder="Nombre"
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Email"
                type="email"
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="Teléfono"
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                placeholder="Puesto"
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />

              <select
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Selecciona un departamento</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>

              {error && (
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={createEmployee}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50 transition"
              >
                {loading ? "Creando..." : "Crear empleado"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}