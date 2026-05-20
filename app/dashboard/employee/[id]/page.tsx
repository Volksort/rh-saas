import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import UploadDocument from "@/components/UploadDocument"
import UpdateDocumentButton from "@/components/UpdateDocumentButton"
import Link from "next/link"

export default async function Employee({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      documents: true,
      department: true,
      company: true,
      incidents: true
    }
  })

  if (!employee) notFound()

  const requiredDocuments = ["INE", "RFC", "CURP", "CONTRATO", "NSS"]
  const uploadedTypes = employee.documents.map(doc => doc.type)
  const completedCount = requiredDocuments.filter(doc => uploadedTypes.includes(doc)).length
  const progressPercent = (completedCount / requiredDocuments.length) * 100

  // Ordenar documentos por fecha (más reciente primero) para la sección "Últimos documentos"
  const sortedDocs = [...employee.documents].sort((a, b) =>
    new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Tarjeta de información del empleado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{employee.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{employee.position || "Sin puesto asignado"}</p>
            </div>
            <Link
              href="/dashboard/employees"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              ← Volver a empleados
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</p>
                <p className="text-gray-900 dark:text-white">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Teléfono</p>
                <p className="text-gray-900 dark:text-white">{employee.phone || "No especificado"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Departamento</p>
                <p className="text-gray-900 dark:text-white">{employee.department?.name || "Sin departamento"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Empresa</p>
                <p className="text-gray-900 dark:text-white">{employee.company.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Documentos con mejoras visuales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 mt-8 transition-colors">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Documentos</h2>

          {/* Grid de 3 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna 1: Subir documento */}
            <div className="lg:col-span-1">
              <UploadDocument employeeId={employee.id} />
            </div>

            {/* Columna 2: Estado de documentos requeridos + barra de progreso */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Documentos requeridos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {requiredDocuments.map(doc => {
                    const exists = uploadedTypes.includes(doc)
                    return (
                      <div
                        key={doc}
                        className={`rounded-lg border p-2 flex items-center gap-2 transition text-sm ${
                          exists
                            ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700"
                            : "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700"
                        }`}
                      >
                        <span className="text-base">{exists ? "✅" : "❌"}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{doc}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {completedCount} de {requiredDocuments.length} documentos completados
                  </p>
                </div>
              </div>
            </div>

            {/* Columna 3: Últimos documentos subidos */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Últimos documentos</h3>
                {employee.documents.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay documentos subidos</p>
                ) : (
                  <ul className="space-y-3">
                    {sortedDocs.slice(0, 3).map(doc => (
                      <li key={doc.id} className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📄</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {doc.type === "OTRO" ? doc.name : doc.type}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Fecha no disponible"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                    {employee.documents.length > 3 && (
                      <li className="text-xs text-emerald-600 dark:text-emerald-400 text-center mt-2">
                        + {employee.documents.length - 3} más
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Lista completa de documentos con scroll y botones */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Todos los documentos</h3>
            {employee.documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                No hay documentos subidos
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
                {sortedDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {doc.type === "OTRO" ? doc.name : `${doc.type} - ${doc.name}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tipo: {doc.type === "OTRO" ? "Otro documento" : doc.type}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Subido: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Fecha desconocida"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.driveUrl && (
                        <a
                          href={doc.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-3 rounded-lg text-sm"
                        >
                          Ver documento
                        </a>
                      )}
                      <UpdateDocumentButton documentId={doc.id} employeeId={employee.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Incidentes */}
        {employee.incidents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 mt-8 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Incidentes</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {employee.incidents.map(incident => (
                <div key={incident.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-700 dark:text-red-400">{incident.description}</p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    {new Date(incident.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}