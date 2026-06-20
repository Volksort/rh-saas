import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const validTypes = ["EARNED", "TAKEN", "ADVANCE", "ADJUSTMENT"]

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.companyId) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const { employeeId, days, type, reason, startDate, endDate } = body

  if (!employeeId || !days || !validTypes.includes(type)) {
    return Response.json(
      { error: "Datos inválidos" },
      { status: 400 }
    )
  }

  const employee = await prisma.employee.findFirst({
    where: {
      id: employeeId,
      companyId: session.user.companyId,
    },
  })

  if (!employee) {
    return Response.json(
      { error: "Empleado no encontrado" },
      { status: 404 }
    )
  }

  const vacation = await prisma.vacationMovement.create({
    data: {
      employeeId,
      days: Number(days),
      type,
      reason: reason || null,
      status: "APPROVED",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      approvedBy: session.user.name || session.user.email || null,
    },
  })

  await prisma.activityLog.create({
    data: {
      companyId: session.user.companyId,
      action: "VACATION_CREATED",
      entityType: "VACATION",
      entityId: vacation.id,
      description: `Movimiento de vacaciones registrado: ${type} (${days} días)`,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
    },
  })

  return Response.json(vacation)
}