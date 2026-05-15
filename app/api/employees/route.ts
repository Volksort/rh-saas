import { prisma } from "@/lib/prisma"
import { createFolder } from "@/lib/drive"

export async function POST(req: Request) {

  try {

    const data = await req.json()

    if (!data.name || !data.email) {

      return Response.json(
        { error: "Datos incompletos" },
        { status: 400 }
      )

    }

    // BUSCAR EMPRESA

    const company = await prisma.company.findUnique({
      where: {
        id: data.companyId
      }
    })

    if (!company) {

      return Response.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      )

    }

    // CREAR CARPETA EMPLEADO

    let employeeFolderId: string | undefined = undefined
    let employeeFolderUrl: string | undefined = undefined

    if (company.driveFolderId) {

      const employeeFolder = await createFolder(
        data.name,
        company.driveFolderId
      )

      employeeFolderId = employeeFolder.id
      employeeFolderUrl = employeeFolder.url

      // SUBCARPETAS

      await createFolder("INE", employeeFolderId)
      await createFolder("RFC", employeeFolderId)
      await createFolder("CURP", employeeFolderId)
      await createFolder("Contrato", employeeFolderId)
      await createFolder("Otros", employeeFolderId)

    }

    // CREAR EMPLEADO

    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId,
        departmentId: data.departmentId,
        status: "ACTIVE",
        hireDate: new Date(),

        driveFolderId: employeeFolderId,
        driveFolderUrl: employeeFolderUrl
      }
    })

    return Response.json(employee)

  } catch (error) {

    console.error(error)

    return Response.json(
      { error: "Error interno" },
      { status: 500 }
    )

  }

}