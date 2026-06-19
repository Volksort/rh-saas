import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, position, companyId, departmentId } = body;

    if (!name?.trim() || !email?.trim() || !companyId || !departmentId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const newEmployee = await prisma.employee.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone?.trim() || null,
        position: position?.trim() || "Sin puesto",
        hireDate: new Date(),
        status: "ACTIVE", 
        companyId,
        departmentId,
      },
    });

    await prisma.activityLog.create({
    data: {
      action: "CREATE_EMPLOYEE",
      entityType: "EMPLOYEE",
      entityId: newEmployee.id,
      description: `Empleado ${newEmployee.name} creado`,
      companyId,
    },
  })

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}