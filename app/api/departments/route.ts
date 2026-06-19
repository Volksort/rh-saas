import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activity-log";

export async function POST(req: Request) {

  const data = await req.json();

  const department = await prisma.department.create({
    data: {
      name: data.name,
      companyId: data.companyId,
    },
  });

  await prisma.activityLog.create({
      data: {
        action: "CREATE_DEPARTMENT",
        entityType: "DEPARTMENT",
        entityId: department.id,
        description: `Departamento ${department.name} creado`,
        companyId: data.companyId,
      },
    })

  return Response.json(department);
}