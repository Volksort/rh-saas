import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EmployeeVacations({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      vacations: true,
      company: true,
    },
  })

  if (!employee) notFound()

  const vacations = employee.vacations ?? []

  const earned = vacations
    .filter(v => v.type === "EARNED")
    .reduce((a, b) => a + b.days, 0)

  const taken = vacations
    .filter(v => v.type === "TAKEN")
    .reduce((a, b) => a + b.days, 0)

  const advance = vacations
    .filter(v => v.type === "ADVANCE")
    .reduce((a, b) => a + b.days, 0)

  const adjustment = vacations
    .filter(v => v.type === "ADJUSTMENT")
    .reduce((a, b) => a + b.days, 0)

  const balance = earned - taken - advance + adjustment

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-white mb-1">
          Vacaciones de {employee.name}
        </h1>

        <p className="text-gray-400 mb-6">
          {employee.company.name}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-600 p-4 rounded-xl text-white">
            Ganados: {earned}
          </div>

          <div className="bg-red-600 p-4 rounded-xl text-white">
            Tomados: {taken}
          </div>

          <div className="bg-yellow-600 p-4 rounded-xl text-white">
            Adelantos: {advance}
          </div>

          <div className="bg-blue-600 p-4 rounded-xl text-white">
            Saldo: {balance}
          </div>
        </div>

        <div className="space-y-3">
          {vacations.map(v => (
            <div key={v.id} className="bg-white dark:bg-gray-800 p-4 rounded">
              <p className="font-bold text-white">
                {v.type} · {v.days} días
              </p>
              <p className="text-gray-400 text-sm">
                {v.reason}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}