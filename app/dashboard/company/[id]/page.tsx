import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function CompanyPage() {

  const session = await getServerSession(authOptions)

  const companyId = session?.user?.companyId

  if (!companyId) {
    notFound()
  }

  const company = await prisma.company.findUnique({
    where: {
      id: companyId
    },
    include: {
      employees: {
        take: 5
      },
      departments: {
        take: 5
      },
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

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        {company.name}
      </h1>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="bg-white p-6 rounded shadow">

          <p className="text-gray-500">
            Empleados
          </p>

          <p className="text-3xl font-bold">
            {company._count.employees}
          </p>

        </div>

        <div className="bg-white p-6 rounded shadow">

          <p className="text-gray-500">
            Departamentos
          </p>

          <p className="text-3xl font-bold">
            {company._count.departments}
          </p>

        </div>

      </div>

      {/* LISTAS */}

      <div className="grid grid-cols-2 gap-10">

        {/* EMPLEADOS */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Últimos empleados
          </h2>

          <div className="bg-white rounded shadow">

            {company.employees.map((emp: any) => (

              <div
                key={emp.id}
                className="p-4 border-b"
              >

                <p className="font-medium">
                  {emp.name}
                </p>

                <p className="text-sm text-gray-500">
                  {emp.email}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* DEPARTAMENTOS */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Últimos departamentos
          </h2>

          <div className="bg-white rounded shadow">

            {company.departments.map((dep: any) => (

              <div
                key={dep.id}
                className="p-4 border-b"
              >

                <p className="font-medium">
                  {dep.name}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}