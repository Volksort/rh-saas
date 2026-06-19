"use client"

import { useEffect, useState } from "react"

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")

  async function loadLogs() {
    setLoading(true)

    const params = new URLSearchParams()

    if (userId) params.append("userId", userId)

    const res = await fetch(`/api/activity-log?${params.toString()}`)
    const data = await res.json()

    setLogs(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLogs()
  }, [userId])

  function getIcon(action: string) {
    switch (action) {
      case "CREATE":
        return "🟢"
      case "DELETE":
        return "🔴"
      case "UPDATE":
        return "🟡"
      default:
        return "⚪"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-6">
          Activity Logs
        </h1>

        {/* SOLO FILTRO OPCIONAL */}
        <input
          placeholder="Filtrar por User ID (opcional)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 mb-4 rounded bg-gray-800 text-white w-full"
        />

        {/* LISTA */}
        <div className="space-y-3">

          {loading ? (
            <p className="text-gray-400">Cargando logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-400">No hay actividad aún</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between"
              >
                <div className="flex gap-3">
                  <div className="text-xl">{getIcon(log.action)}</div>

                  <div>
                    <p className="text-white font-semibold">
                      {log.description}
                    </p>

                    <p className="text-sm text-gray-400">
                      {log.userName ?? "Sistema"} · {log.entityType}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  )
}