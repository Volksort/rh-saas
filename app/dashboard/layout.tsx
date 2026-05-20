import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/DashboardShell"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  // El rol ya viene en la sesión por cómo configuras NextAuth
  // Asegúrate de que en tu archivo de auth estás incluyendo el rol
  const sessionWithRole = {
    ...session,
    user: {
      ...session.user,
      role: session.user.role || "USER"
    }
  }

  return (
    <DashboardShell session={sessionWithRole}>
      {children}
    </DashboardShell>
  )
}