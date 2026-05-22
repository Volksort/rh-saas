import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, companyId } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan nombre, email o contraseña' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // ID de empresa por defecto (CÁMBIALO por un ID real de tu tabla Company)
    const DEFAULT_COMPANY_ID = 'TU_COMPANY_ID_AQUI'

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyId: companyId || DEFAULT_COMPANY_ID,
        role: 'ADMIN',
      },
    })

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}