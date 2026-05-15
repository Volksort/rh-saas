export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
      {/* Logo futurista */}
      <div className="relative mb-8 group">
        {/* Efecto de glow detrás del logo */}
        <div className="absolute inset-0 blur-2xl bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
        
        <svg
          className="w-32 h-auto md:w-40 lg:w-48 text-emerald-600 dark:text-emerald-400 drop-shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 1500 700"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0,1024) scale(0.1,-0.1)">
            <path d="M8038 9200 c185 -20 443 -81 619 -146 179 -67 465 -215 581 -303 l33 -24 -678 -679 -678 -678 363 -362 362 -363 665 665 c365 365 666 662 669 660 21 -23 127 -232 171 -340 450 -1087 135 -2312 -781 -3040 -829 -659 -1989 -742 -2908 -208 l-69 40 1058 1058 c781 781 1055 1061 1049 1071 -5 8 -246 249 -535 537 -380 377 -532 522 -548 522 -30 0 -1295 78 -1391 85 l-75 7 225 -227 c124 -124 363 -361 531 -526 l307 -299 426 -27 427 -27 -936 -936 -936 -935 -87 90 c-408 419 -662 965 -723 1553 -17 164 -6 514 20 668 78 458 255 854 542 1215 408 512 1038 862 1699 944 129 16 467 19 598 5z" />
          </g>
        </svg>
      </div>

      {/* Título futurista */}
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent animate-gradient">
        RH Digital
      </h1>

      <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-md">
        Sistema de gestión de recursos humanos con inteligencia futurista
      </p>

      {/* Botón con efectos */}
      <a
        href="/login"
        className="mt-8 relative group overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
      >
        <span className="relative z-10">Iniciar sesión</span>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -inset-1 bg-emerald-400 blur opacity-30 group-hover:opacity-100 transition duration-300 rounded-lg" />
      </a>

      {/* Elementos decorativos futuristas (opcional) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
      <div className="fixed top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
    </main>
  )
}