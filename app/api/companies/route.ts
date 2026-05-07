import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  try {

    const data = await req.json()

    let driveFolderId = null

    if (data.driveUrl) {

      const match = data.driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/)

      if (match) {
        driveFolderId = match[1]
      }

    }

    const company = await prisma.company.create({
      data: {
        name: data.name,
        driveFolderUrl: data.driveUrl || null,
        driveFolderId: driveFolderId
      }
    })

    return Response.json(company)

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