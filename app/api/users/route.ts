import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req:Request){

  const data = await req.json()

  const users = await prisma.user.count({
    where:{
      companyId:data.companyId
    }
  })

  if(users >= 2){
    return Response.json(
      {error:"Tu plan solo permite 2 usuarios"},
      {status:400}
    )
  }

  const password = await bcrypt.hash(data.password,10)

  const user = await prisma.user.create({
    data:{
      name:data.name,
      email:data.email,
      password,
      role:data.role,
      companyId:data.companyId
    }
  })

  await prisma.activityLog.create({
      data: {
        action: "CREATE_USER",
        entityType: "USER",
        entityId: user.id,
        description: `Usuario ${user.name} creado`,
        companyId: user.companyId,
      },
    })

  return Response.json(user)
}