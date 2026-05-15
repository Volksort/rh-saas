import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import UploadDocument from "@/components/UploadDocument"

export default async function EmployeePage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const employee = await prisma.employee.findUnique({
    where: {
      id
    },
    include: {
      documents: true,
      department: true,
      company: true,
      incidents: true
    }
  })

  if (!employee) {
    notFound()
  }

  return (

    <div className="p-10">

      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-2">
          {employee.name}
        </h1>

        <p className="text-gray-500 mb-6">
          {employee.position}
        </p>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <p className="font-semibold">
              Email
            </p>

            <p className="text-gray-600">
              {employee.email}
            </p>

          </div>

          <div>

            <p className="font-semibold">
              Teléfono
            </p>

            <p className="text-gray-600">
              {employee.phone}
            </p>

          </div>

          <div>

            <p className="font-semibold">
              Departamento
            </p>

            <p className="text-gray-600">
              {employee.department?.name}
            </p>

          </div>

          <div>

            <p className="font-semibold">
              Empresa
            </p>

            <p className="text-gray-600">
              {employee.company.name}
            </p>

          </div>

        </div>

      </div>

      {/* DOCUMENTOS */}

      <div className="bg-white rounded-xl shadow p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Documentos
        </h2>

        {employee.documents.length === 0 ? (

          <p className="text-gray-500">
            No hay documentos
          </p>

        ) : (

          <div className="space-y-3">

            {employee.documents.map((doc: any) => (

              <a
                key={doc.id}
                href={doc.driveUrl}
                target="_blank"
                className="
                  block
                  border
                  rounded-lg
                  p-4
                  hover:bg-gray-50
                  transition
                "
              >

                <p className="font-medium">
                  {doc.name}
                </p>

              </a>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}