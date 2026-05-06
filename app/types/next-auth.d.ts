import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
    companyId: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      companyId: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    companyId: string
  }
}