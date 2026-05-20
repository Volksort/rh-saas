// components/UpdateDocumentButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { RefreshCw, Upload } from 'lucide-react'

export default function UpdateDocumentButton({
  documentId,
  employeeId
}: {
  documentId: string
  employeeId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentId', documentId)
    formData.append('employeeId', employeeId)

    try {
      const res = await fetch('/api/update-document', {
        method: 'PUT',
        body: formData
      })
      if (!res.ok) throw new Error()
      toast.success('Documento actualizado')
      setIsOpen(false)
      setFile(null)
      router.refresh()
    } catch (error) {
      toast.error('Error al actualizar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg text-sm flex items-center gap-1"
      >
        <RefreshCw size={14} />
        Actualizar
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Actualizar documento
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Selecciona el nuevo archivo para reemplazar el actual
              </p>
            </div>

            <div className="p-6">
              {/* Área de subida de archivo */}
              <label className={`
                border-2 border-dashed rounded-xl p-8
                flex flex-col items-center justify-center
                cursor-pointer transition-all duration-200
                ${file 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
              `}>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {file ? (
                  <>
                    <Upload size={48} className="text-emerald-500 mb-3" />
                    <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setFile(null)
                      }}
                      className="mt-3 text-sm text-red-600 hover:text-red-700"
                    >
                      Eliminar archivo
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={48} className="text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      PDF, JPG o PNG (MAX. 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-3 p-6 pt-0">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={!file || uploading}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition"
              >
                {uploading ? 'Actualizando...' : 'Actualizar documento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}