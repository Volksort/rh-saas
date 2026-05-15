"use client"

import { useState } from "react"

export default function Employees() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function createEmployee() {
    if (!name || !email) {
      setMessage({ type: "error", text: "Nombre y email son obligatorios" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          position,
          // ⚠️ Estos IDs fijos deberían ser dinámicos en un entorno real
          companyId: "cmmmw2iv90000r4nkpheslzzn",
          departmentId: "cmmmxjx330004r4nk3xyrmmwf"
        })
      })

      if (!res.ok) throw new Error("Error al crear empleado")

      setMessage({ type: "success", text: "Empleado creado correctamente" })
      // Limpiar formulario
      setName("")
      setEmail("")
      setPhone("")
      setPosition("")
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Error al crear empleado" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 transition-colors">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Crear empleado
          </h1>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Puesto
              </label>
              <input
                type="text"
                placeholder="Puesto"
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}>
                {message.text}
              </div>
            )}

            <button
              onClick={createEmployee}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-2 rounded-lg disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? "Creando..." : "Crear empleado"}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              * Campos obligatorios
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}