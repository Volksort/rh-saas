"use client"

import { signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const MAX_ATTEMPTS = 5
const LOCK_TIME = 5 * 60 * 1000

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null)

  useEffect(() => {
    const logoutIfSessionExists = async () => {
      const res = await fetch("/api/auth/session", {
        cache: "no-store",
      })

      const session = await res.json()

      if (session?.user) {
        await signOut({
          redirect: false,
        })
      }
    }

    logoutIfSessionExists()

    const storedBlock = localStorage.getItem("loginBlockedUntil")

    if (storedBlock) {
      const time = Number(storedBlock)

      if (time > Date.now()) {
        setBlockedUntil(time)
      } else {
        localStorage.removeItem("loginBlockedUntil")
        localStorage.removeItem("loginAttempts")
      }
    }
  }, [])

  const handleFailedAttempt = () => {
    const attempts = Number(localStorage.getItem("loginAttempts") || "0") + 1

    localStorage.setItem("loginAttempts", String(attempts))

    if (attempts >= MAX_ATTEMPTS) {
      const blockUntil = Date.now() + LOCK_TIME

      localStorage.setItem("loginBlockedUntil", String(blockUntil))
      setBlockedUntil(blockUntil)
      setError("Demasiados intentos. Intenta nuevamente en 5 minutos.")
      return
    }

    setError(`Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - attempts}`)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (blockedUntil && blockedUntil > Date.now()) {
      setError("Demasiados intentos. Intenta nuevamente más tarde.")
      return
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!isValidEmail(cleanEmail)) {
      setError("Ingresa un correo válido.")
      return
    }

    if (cleanPassword.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.")
      return
    }

    setLoading(true)

    const res = await signIn("credentials", {
      email: cleanEmail,
      password: cleanPassword,
      redirect: false,
    })

    if (res?.error) {
      handleFailedAttempt()
      setLoading(false)
      return
    }

    localStorage.removeItem("loginAttempts")
    localStorage.removeItem("loginBlockedUntil")

    const sessionRes = await fetch("/api/auth/session", {
      cache: "no-store",
    })

    const session = await sessionRes.json()
    const role = session?.user?.role

    if (role === "ADMIN") {
      router.replace("/dashboard/companies")
    } else if (role === "COMPANY_ADMIN") {
      router.replace("/dashboard/company")
    } else {
      router.replace("/dashboard")
    }

    setLoading(false)
  }

  const isBlocked = blockedUntil !== null && blockedUntil > Date.now()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <svg
            className="w-24 h-auto text-gray-800 dark:text-white"
            viewBox="0 0 1500 700"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0,1024) scale(0.1,-0.1)">
              <path d="M8038 9200 c185 -20 443 -81 619 -146 179 -67 465 -215 581 -303 l33 -24 -678 -679 -678 -678 363 -362 362 -363 665 665 c365 365 666 662 669 660 21 -23 127 -232 171 -340 450 -1087 135 -2312 -781 -3040 -829 -659 -1989 -742 -2908 -208 l-69 40 1058 1058 c781 781 1055 1061 1049 1071 -5 8 -246 249 -535 537 -380 377 -532 522 -548 522 -30 0 -1295 78 -1391 85 l-75 7 225 -227 c124 -124 363 -361 531 -526 l307 -299 426 -27 427 -27 -936 -936 -936 -935 -87 90 c-408 419 -662 965 -723 1553 -17 164 -6 514 20 668 78 458 255 854 542 1215 408 512 1038 862 1699 944 129 16 467 19 598 5z" />
            </g>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Iniciar sesión
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Acceso privado para empresas registradas
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full mb-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            className="w-full mb-4 p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || isBlocked}
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-3 rounded-xl disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? "Entrando..." : isBlocked ? "Bloqueado temporalmente" : "Entrar"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          Si necesitas acceso, contacta al administrador del sistema.
        </p>
      </div>
    </div>
  )
}