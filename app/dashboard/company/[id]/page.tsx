import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import CreateDepartmentModal from "@/components/CreateDepartmentModal"

export default async function CompanyPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      employees: { take: 5 },
      departments: { take: 5 },
      _count: {
        select: {
          employees: true,
          departments: true
        }
      }
    }
  })

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {company.name}
          </h1>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/employees/${company.id}`}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded transition-colors"
            >
              Ver empleados
            </Link>
            <CreateDepartmentModal companyId={company.id} />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
            <p className="text-gray-500 dark:text-gray-400">Empleados</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {company._count.employees}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
            <p className="text-gray-500 dark:text-gray-400">Departamentos</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {company._count.departments}
            </p>
          </div>
        </div>

        {/* LISTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* EMPLEADOS */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Últimos empleados
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transition-colors">
              {company.employees.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No hay empleados registrados.
                </div>
              ) : (
                company.employees.map((emp: any) => (
                  <div
                    key={emp.id}
                    className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {emp.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {emp.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DEPARTAMENTOS */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Últimos departamentos
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transition-colors">
              {company.departments.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No hay departamentos registrados.
                </div>
              ) : (
                company.departments.map((dep: any) => (
                  <div
                    key={dep.id}
                    className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {dep.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}