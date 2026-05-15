"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  LayoutDashboard,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"

export default function DashboardShell({
  children,
  session
}: {
  children: React.ReactNode
  session: any
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const role = session.user.role

  const links: {
    href: string
    label: string
    icon: any
  }[] = []

  if (role === "USER") {
    links.push({ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard })
  }
  if (role === "ADMIN") {
    links.push({ href: "/dashboard/companies", label: "Empresas", icon: Building2 })
  }
  if (role === "COMPANY_ADMIN") {
    links.push(
      { href: "/dashboard/company", label: "Empresa", icon: Building2 },
      { href: "/dashboard/employees", label: "Empleados", icon: Users }
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      {/* SIDEBAR */}
      <aside
        className={`
          relative
          transition-all
          duration-300
          border-r
          border-gray-200
          dark:border-gray-800
          bg-white
          dark:bg-gray-900
          flex
          flex-col
          shadow-sm
          ${collapsed ? "w-24" : "w-72"}
        `}
      >
        {/* HEADER */}
        <div className="h-20 px-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                RH SaaS
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Panel administrativo</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* NAVEGACIÓN - SIN flex-1 para que no empuje el footer hacia abajo */}
        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  duration-200
                  font-medium
                  group
                  ${
                    active
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <Icon size={22} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* FOOTER - ahora estará justo después del nav (más arriba) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form action="/api/auth/signout" method="POST">
            <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl transition font-medium">
              <LogOut size={18} />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bienvenido</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.name}</p>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </main>
    </div>
  )
}