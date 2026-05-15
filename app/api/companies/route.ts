import { prisma } from "@/lib/prisma"
import { drive } from "@/lib/google"

export async function POST(req: Request) {

  try {

    const data = await req.json()

    if (!data.name) {

      return Response.json(
        { error: "Nombre requerido" },
        { status: 400 }
      )

    }

    // CREAR CARPETA EN DRIVE

    const folder = await drive.files.create({

      requestBody: {

        name: data.name,

        mimeType: "application/vnd.google-apps.folder",

        parents: [
          process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!
        ]

      },

      fields: "id, webViewLink"

    })

    // CREAR EMPRESA EN DB

    const company = await prisma.company.create({

      data: {

        name: data.name,

        driveFolderId: folder.data.id!,

        driveFolderUrl: folder.data.webViewLink!

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