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

    // Obtener sesión actualizada
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const role = session?.user?.role
    const companyId = session?.user?.companyId

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
      // Limpiar y ocultar registro tras 2 segundos
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        {!showRegister ? (
          // Formulario de Login
          <>
            <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full mb-4 p-2 border rounded"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setShowRegister(true)}
              className="w-full mt-3 text-sm text-emerald-600 hover:underline"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </>
        ) : (
          // Formulario de Registro
          <>
            <h1 className="text-xl font-bold mb-4">Crear cuenta de prueba</h1>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Nombre completo"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
              <input
                type="email"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Contraseña"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded"
                placeholder="Company ID (opcional, déjalo vacío para usar el predeterminado)"
                value={regCompanyId}
                onChange={(e) => setRegCompanyId(e.target.value)}
              />
              {regError && <p className="text-red-500 text-sm mb-2">{regError}</p>}
              {regSuccess && <p className="text-green-600 text-sm mb-2">{regSuccess}</p>}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-50"
              >
                {regLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  )
}