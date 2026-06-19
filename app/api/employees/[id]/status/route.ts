import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;


    const body = await request.json();

    const { status } = body;


    if (!["ACTIVE", "INACTIVE"].includes(status)) {

      return NextResponse.json(
        {
          error:"Estado inválido"
        },
        {
          status:400
        }
      );

    }


    const employee = await prisma.employee.update({

      where:{
        id:id
      },

      data:{
        status
      }

    });

    await prisma.activityLog.create({
    data: {
      action: "CHANGE_EMPLOYEE_STATUS",
      entityType: "EMPLOYEE",
      entityId: employee.id,
      description: `${employee.name} cambiado a ${status}`,
      companyId: employee.companyId,
    },
  })


    return NextResponse.json(employee);


  } catch(error){

    console.error(error);


    return NextResponse.json(
      {
        error:"Error actualizando estado"
      },
      {
        status:500
      }
    );

  }

}