import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { name, email, password, companyId, role } = await request.json()

    const cleanName = String(name || "").trim()
    const cleanEmail = String(email || "").trim().toLowerCase()
    const cleanPassword = String(password || "")
    const cleanCompanyId = String(companyId || "").trim()

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanCompanyId) {
      return NextResponse.json(
        { error: "Nombre, email, contraseña y empresa son obligatorios" },
        { status: 400 }
      )
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    if (cleanPassword.length < 6 || cleanPassword.length > 100) {
      return NextResponse.json(
        { error: "La contraseña debe tener entre 6 y 100 caracteres" },
        { status: 400 }
      )
    }

    const company = await prisma.company.findUnique({
      where: { id: cleanCompanyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: "La empresa no existe" },
        { status: 404 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10)

    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        companyId: cleanCompanyId,
        role: role === "USER" ? "USER" : "COMPANY_ADMIN",
      },
    })

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error en registro:", error)

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}