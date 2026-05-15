import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import CreateEmployeeModal from "@/components/CreateEmployeeModal"
import Link from "next/link"

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions)
  const companyId = session?.user?.companyId

  if (!companyId) notFound()

  const departments = await prisma.department.findMany({
    where: { companyId },
    include: { employees: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Todos los empleados
          </h1>
          <CreateEmployeeModal
            companyId={companyId}
            departments={departments}
          />
        </div>

        <div className="space-y-8">
          {departments.map((department: any) => (
            <div
              key={department.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
                {department.name}
              </h2>

              {department.employees.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay empleados en este departamento
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {department.employees.map((employee: any) => (
                    <Link
                      href={`/dashboard/employee/${employee.id}`}
                      key={employee.id}
                      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                    >
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">
                        {employee.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {employee.email}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}