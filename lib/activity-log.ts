import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"

export async function createActivityLog({
  action,
  entityType,
  entityId,
  description,
  companyId,
}: {
  action: string
  entityType: string
  entityId?: string
  description: string
  companyId?: string
}) {

  const session = await getServerSession(authOptions)

await prisma.activityLog.create({
  data: {
    action,
    entityType,
    description,

    entityId: entityId ?? undefined,

    company: {
      connect: {
        id: companyId!,
      },
    },

    userId: session?.user?.id ?? undefined,
    userName: session?.user?.name ?? undefined,
    userEmail: session?.user?.email ?? undefined,
  },
})
}