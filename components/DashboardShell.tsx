"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageCircle,
} from "lucide-react"

export default function DashboardShell({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const role = session.user.role

  useEffect(() => {
    const homePaths = [
      "/dashboard",
      "/dashboard/company",
      "/dashboard/companies",
    ]

    const isHomePath = homePaths.includes(pathname)

    if (!isHomePath) return

    window.history.pushState(null, "", window.location.href)

    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href)

      toast.warning("Estás en la página principal", {
        description: "Usa el botón Cerrar sesión si deseas salir del sistema.",
        duration: 5000,
      })
    }

    window.addEventListener("popstate", handleBackButton)

    return () => {
      window.removeEventListener("popstate", handleBackButton)
    }
  }, [pathname])

  const whatsappUrl =
    "https://wa.me/525655185966?text=Hola,%20necesito%20ayuda%20con%20RH%20SaaS"

  const links: {
    href: string
    label: string
    icon: any
  }[] = []

  if (role === "USER") {
    links.push({
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    })
  }

  if (role === "ADMIN") {
    links.push({
      href: "/dashboard/companies",
      label: "Empresas",
      icon: Building2,
    })
  }

  if (role === "COMPANY_ADMIN") {
    links.push(
      {
        href: "/dashboard/company",
        label: "Empresa",
        icon: Building2,
      },
      {
        href: "/dashboard/employees",
        label: "Empleados",
        icon: Users,
      },
      {
        href: "/dashboard/vacations",
        label: "Vacaciones",
        icon: CalendarDays,
      },
      {
        href: "/dashboard/activity",
        label: "Actividad",
        icon: ClipboardList,
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
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
        <div className="h-20 px-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                RH SaaS
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Panel administrativo
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

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

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl transition font-medium"
          >
            <MessageCircle size={18} />
            {!collapsed && <span>Ayuda</span>}
          </a>

          <button
            type="button"
            onClick={() =>
              toast.warning("¿Cerrar sesión?", {
                description: "Tendrás que volver a iniciar sesión.",
                action: {
                  label: "Cerrar sesión",
                  onClick: () =>
                    signOut({
                      callbackUrl: "/login",
                    }),
                },
                cancel: {
                  label: "Cancelar",
                  onClick: () => {},
                },
                duration: 8000,
              })
            }
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl transition font-medium"
          >
            <LogOut size={18} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Atrás"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => window.history.forward()}
                className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Adelante"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Bienvenido
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.user.name}
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition font-medium"
          >
            <MessageCircle size={18} />
            Ayuda
          </a>
        </header>

        <div className="flex-1">{children}</div>
      </main>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed
          bottom-6
          right-6
          bg-green-500
          hover:bg-green-600
          text-white
          p-4
          rounded-full
          shadow-xl
          z-50
          md:hidden
        "
        title="Ayuda por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  )
}