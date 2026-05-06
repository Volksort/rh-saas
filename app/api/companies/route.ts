import { prisma } from "@/lib/prisma"



export async function POST(req: Request){
  console.log(process.env.DATABASE_URL)
  const data = await req.json()

  const company = await prisma.company.create({
    data:{
      name:data.name
    }
  })

  return Response.json(company)
}

export async function GET(){

    const companies = await prisma.company.findMany({
    include:{
      employees:true
    }
  })

  return Response.json(companies)
}