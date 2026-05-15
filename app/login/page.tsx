'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  // Estados para login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Estados para registro
  const [showRegister, setShowRegister] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regCompanyId, setRegCompanyId] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Credenciales incorrectas')
      setLoading(false)
      return
    }

    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const role = session?.user?.role

    if (role === 'ADMIN') {
      router.push('/dashboard/companies')
    } else if (role === 'COMPANY_ADMIN') {
      router.push('/dashboard/company')
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    setRegError('')
    setRegSuccess('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          companyId: regCompanyId || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al registrar')

      setRegSuccess('¡Usuario creado! Ya puedes iniciar sesión.')
      setTimeout(() => {
        setShowRegister(false)
        setRegSuccess('')
        setRegName('')
        setRegEmail('')
        setRegPassword('')
        setRegCompanyId('')
      }, 2000)
    } catch (err: any) {
      setRegError(err.message)
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-80 transition-colors duration-300">
        {/* Logo - se adapta al tema */}
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

        {!showRegister ? (
          <>
            <h1 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Iniciar sesión
            </h1>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="w-full mb-3 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full mb-4 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <p className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-2 rounded disabled:opacity-50 transition-colors"
              >
                {loading ? 'Entrando...' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setShowRegister(true)}
              className="w-full mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Crear cuenta
            </h1>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="Nombre completo"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
              <input
                type="email"
                className="w-full mb-3 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full mb-3 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="Contraseña"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="Company ID (opcional)"
                value={regCompanyId}
                onChange={(e) => setRegCompanyId(e.target.value)}
              />
              {regError && (
                <p className="text-red-600 dark:text-red-400 text-sm mb-2">{regError}</p>
              )}
              {regSuccess && (
                <p className="text-green-600 dark:text-green-400 text-sm mb-2">
                  {regSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-2 rounded disabled:opacity-50 transition-colors"
              >
                {regLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  )
}