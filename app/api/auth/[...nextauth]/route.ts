import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'


// Si quieres usar PrismaAdapter, instálalo: npm install @next-auth/prisma-adapter
// Si no, manejamos sesiones manualmente. Aquí lo haré manual para que veas el proceso.

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Faltan credenciales')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Usuario no encontrado')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Contraseña incorrecta')
        }

        // Retornamos el objeto user sin la contraseña
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt', // Usamos JWT para sesiones (más simple)
  },
  pages: {
    signIn: '/login',
    error: '/login', // Página de error personalizada
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Solo para depuración
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }