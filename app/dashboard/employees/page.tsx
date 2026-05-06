import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import CreateEmployeeModal from "@/components/CreateEmployeeModal"

export default async function EmployeesPage() {

  const session = await getServerSession(authOptions)

  const companyId = session?.user?.companyId

  if (!companyId) {
    notFound()
  }

  const departments = await prisma.department.findMany({
    where: {
      companyId
    },
    include: {
      employees: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (

    <div className="p-10">

        <div className="flex items-center justify-between mb-10">

          <h1 className="text-3xl font-bold">
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
            className="bg-white rounded-xl shadow p-6"
          >

            <h2 className="text-2xl font-semibold mb-6 text-emerald-700">
              {department.name}
            </h2>

            {department.employees.length === 0 ? (

              <p className="text-gray-500">
                No hay empleados en este departamento
              </p>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {department.employees.map((employee: any) => (

                  <div
                    key={employee.id}
                    className="border rounded-lg p-4 hover:shadow transition"
                  >

                    <p className="font-semibold text-lg">
                      {employee.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {employee.email}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  )
}