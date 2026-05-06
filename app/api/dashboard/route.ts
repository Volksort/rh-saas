import { prisma } from "@/lib/prisma"

export async function GET() {

  const employees = await prisma.employee.count()

  const departments = await prisma.department.count()

  const incidents = await prisma.incident.count()

  return Response.json({
    employees,
    departments,
    incidents
  })
}