import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.companyId) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()

  const { employeeId, days, type, reason } = body

  const vacation = await prisma.vacationMovement.create({
    data: {
      employeeId,
      days: Number(days),
      type,
      reason,
      status: "APPROVED", // 👈 por ahora simplificado
    },
  })

  // 🔥 LOG AUTOMÁTICO
  await prisma.activityLog.create({
    data: {
      companyId: session.user.companyId,
      action: "VACATION_CREATED",
      entityType: "VACATION",
      entityId: vacation.id,
      description: `Vacación registrada (${days} días)`,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
    },
  })

  return Response.json(vacation)
}