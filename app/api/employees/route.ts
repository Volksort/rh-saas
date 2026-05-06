import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const data = await req.json()

    const employee = await prisma.employee.create({
    data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId,
        departmentId: data.departmentId,
        status: "ACTIVE",
        hireDate: new Date()
    }
    })
        if(!data.name || !data.email){
        return Response.json({error:"Datos incompletos"})
        }

  return Response.json(employee)
}