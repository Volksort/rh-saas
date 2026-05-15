"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([])
  const [name, setName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState("")

  const router = useRouter()

  async function loadCompanies() {
    const res = await fetch("/api/companies")
    const data = await res.json()
    setCompanies(data)
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  async function createCompany() {
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    setShowModal(false)
    setName("")
    loadCompanies()
  }

  const selectedCompany = companies.find(c => c.id === selectedCompanyId)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Empresas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PANEL IZQUIERDO - Lista de empresas */}
          <div>
  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      Lista de empresas
    </h2>
    <button
      onClick={() => setShowModal(true)}
      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors"
    >
      + Crear empresa
    </button>
  </div>

  <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transition-colors">
    {companies.length === 0 ? (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No hay empresas. Crea la primera.
      </div>
    ) : (
      <>
        {/* Contenedor con altura máxima y scroll */}
        <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
          {companies.map((company) => (
            <div
              key={company.id}
              className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                  {company.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {company.employees?.length || 0} empleados
                </p>
                {company.driveFolderUrl && (
                  <a
                    href={company.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Abrir carpeta Drive
                  </a>
                )}
              </div>
              <button
                onClick={() => router.push(`/dashboard/company/${company.id}`)}
                className="text-sm bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Ver empresa
              </button>
            </div>
          ))}
        </div>
        {/* Opcional: contador de empresas */}
        <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          Mostrando {companies.length} empresa{companies.length !== 1 && 's'}
        </div>
      </>
    )}
  </div>
</div>

          {/* PANEL DERECHO - Información de empresa */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Información empresa
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
              <select
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 w-full mb-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Seleccionar empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>

              {selectedCompany ? (
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><span className="font-medium">ID:</span> {selectedCompany.id}</p>
                  <p><span className="font-medium">Empleados:</span> {selectedCompany.employees?.length || 0}</p>
                  {selectedCompany.driveFolderUrl && (
                    <p>
                      <span className="font-medium">Drive:</span>{" "}
                      <a href={selectedCompany.driveFolderUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        Carpeta
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Selecciona una empresa para ver detalles.
                </p>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Rotación de empleados (próximamente)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL CREAR EMPRESA */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl transition-colors">
              <h2 className="text-2xl font-bold mb-6">Crear empresa</h2>
              <input
                placeholder="Nombre empresa"
                className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 w-full mb-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={createCompany}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl transition"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}