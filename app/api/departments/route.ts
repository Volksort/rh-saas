import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const data = await req.json()

  const department = await prisma.department.create({
    data: {
      name: data.name,
      companyId: data.companyId
    }
  })

  return Response.json(department)
}

export async function GET() {

  const departments = await prisma.department.findMany({
    include:{
      company:true
    }
  })

  return Response.json(departments)
}