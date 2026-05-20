"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"  // ← Agrega esto

export default function UploadDocument({
  employeeId
}: {
  employeeId: string
}) {
  const router = useRouter()  // ← Agrega esto
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [customName, setCustomName] = useState("")
  const [documentType, setDocumentType] = useState("INE")

  async function handleUpload() {
    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("employeeId", employeeId)
      formData.append("documentType", documentType)
      formData.append("customName", customName)

      const res = await fetch("/api/upload-document", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        toast.error("Error subiendo documento")
        return
      }

      toast.success("Documento subido correctamente")
      
      // ← CAMBIA ESTAS LÍNEAS
      router.refresh()  // Refresca los datos del server component
      
      // Limpiar el formulario
      setFile(null)
      setDocumentType("INE")
      setCustomName("")
      
    } catch (error) {
      console.log(error)
      toast.error("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="
      bg-white
      dark:bg-zinc-900
      border
      border-zinc-200
      dark:border-zinc-800
      rounded-2xl
      p-5
      w-full
      max-w-md
      shadow-lg
    ">
      <h3 className="
        text-xl
        font-bold
        text-zinc-900
        dark:text-white
        mb-4
      ">
        Subir documento
      </h3>

      {/* SELECT DOCUMENTO */}
      <div className="mb-4">
        <label className="
          block
          text-sm
          font-medium
          text-zinc-700
          dark:text-zinc-300
          mb-2
        ">
          Tipo de documento
        </label>

        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-zinc-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-800
            px-4
            py-3
            text-zinc-900
            dark:text-white
            outline-none
            focus:ring-2
            focus:ring-emerald-500
          "
        >
          <option value="INE">INE</option>
          <option value="RFC">RFC</option>
          <option value="CURP">CURP</option>
          <option value="CONTRATO">Contrato</option>
          <option value="NSS">NSS</option>
          <option value="OTRO">Otro</option>
        </select>

        {documentType === "OTRO" && (
          <input
            type="text"
            placeholder="Nombre del documento"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="
              w-full
              mt-3
              rounded-xl
              border
              border-zinc-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-800
              px-4
              py-3
              text-zinc-900
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />
        )}
      </div>

      {/* FILE */}
      <label className="
        border-2
        border-dashed
        border-zinc-300
        dark:border-zinc-700
        rounded-2xl
        p-6
        flex
        flex-col
        items-center
        justify-center
        cursor-pointer
        hover:border-emerald-500
        transition
      ">
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0])
            }
          }}
        />
        <p className="
          text-zinc-500
          dark:text-zinc-400
          text-sm
          text-center
        ">
          {file
            ? file.name
            : "Haz click para seleccionar archivo"
          }
        </p>
        <span className="
          text-xs
          text-zinc-400
          mt-2
        ">
          PDF, imágenes o documentos
        </span>
      </label>

      {/* BOTON */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="
          w-full
          mt-5
          bg-emerald-600
          hover:bg-emerald-700
          disabled:opacity-50
          text-white
          py-3
          rounded-xl
          font-medium
          transition
        "
      >
        {loading ? "Subiendo..." : "Subir documento"}
      </button>
    </div>
  )
}