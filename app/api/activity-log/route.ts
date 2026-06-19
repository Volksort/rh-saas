import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return Response.json([], { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const logs = await prisma.activityLog.findMany({
      where: {
        companyId: session.user.companyId, // 🔥 SIEMPRE de la empresa del usuario
        ...(userId ? { userId } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    })

    return Response.json(logs)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Error obteniendo logs" },
      { status: 500 }
    )
  }
}