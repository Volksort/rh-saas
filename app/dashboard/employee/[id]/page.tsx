import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import UploadDocument from "@/components/UploadDocument"
import Link from "next/link"

export default async function EmployeePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Información del empleado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {employee.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {employee.position || "Sin puesto asignado"}
              </p>
            </div>
            <Link
              href={`/dashboard/employees`}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
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

        {/* Documentos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 mt-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Documentos
            </h2>
            <UploadDocument employeeId={employee.id} />
          </div>

          {employee.documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No hay documentos subidos
            </div>
          ) : (
            <div className="space-y-3">
              {employee.documents.map((doc: any) => (
                <a
                  key={doc.id}
                  href={doc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {doc.driveUrl ? "Ver en Google Drive" : "Documento"}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Incidentes (opcional) */}
        {employee.incidents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 mt-8 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Incidentes
            </h2>
            <div className="space-y-2">
              {employee.incidents.map((incident: any) => (
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