export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      
      <h1 className="text-5xl font-bold text-emerald-700">
        RH Digital
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Sistema de gestión de recursos humanos
      </p>

      <a
        href="/login"
        className="mt-8 bg-emerald-600 text-white px-6 py-3 rounded-lg"
      >
        Iniciar sesión
      </a>

    </main>
  )
}