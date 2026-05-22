"use client"

import { useState } from "react"

type Department = {
  id: string
  name: string
}

export default function DepartmentsModal({ departments }: { departments: Department[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!departments.length) return null

  return (
    <>
      {/* Trigger: contador clickeable */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-3xl font-bold text-gray-900 dark:text-white hover:underline focus:outline-none"
      >
        {departments.length}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transition-colors">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Departamentos ({departments.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {departments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No hay departamentos</p>
              ) : (
                <ul className="space-y-2">
                  {departments.map((dep) => (
                    <li
                      key={dep.id}
                      className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-white"
                    >
                      {dep.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}