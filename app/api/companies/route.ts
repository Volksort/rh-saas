import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  try {

    const data = await req.json()

    if (!data.name) {

      return Response.json(
        { error: "Nombre requerido" },
        { status: 400 }
      )

    }





  } catch (error) {

    console.log(error)

    return Response.json(
      {
        error: "Error creando empresa"
      },
      {
        status: 500
      }
    )

  }

}

export async function GET() {

  const companies = await prisma.company.findMany({

    include: {
      employees: true
    }

  })

  return Response.json(companies)

}