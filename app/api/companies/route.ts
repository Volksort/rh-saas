import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name) {
      return Response.json(
        { error: "Nombre requerido" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: data.name,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_COMPANY",
        entityType: "COMPANY",
        entityId: company.id,
        description: `Empresa ${company.name} creada`,
        companyId: company.id,
      },
    });

    return Response.json(company);

  } catch (error) {
    console.log(error);

    return Response.json(
      { error: "Error creando empresa" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {

    const companies = await prisma.company.findMany({
      include: {
        employees: true,
      },
    });

    return Response.json(companies);

  } catch (error) {

    console.log(error);

    return Response.json(
      { error: "Error obteniendo empresas" },
      { status: 500 }
    );
  }
}