"use client"

import { useState } from "react"

export default function UploadDocument({
  employeeId
}: {
  employeeId: string
}) {

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function upload() {

    if (!file) return

    setLoading(true)

    const formData = new FormData()

    formData.append("file", file)
    formData.append("employeeId", employeeId)

    await fetch("/api/upload-document", {
      method: "POST",
      body: formData
    })

    setLoading(false)

    location.reload()
  }

  return (

    <div className="border rounded-xl p-6 bg-white shadow">

      <h3 className="text-xl font-semibold mb-4">
        Subir documento
      </h3>

      <label className="
        flex
        items-center
        justify-center
        border-2
        border-dashed
        border-gray-300
        rounded-xl
        p-8
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

        <div className="text-center">

          <p className="font-medium">
            {file
              ? file.name
              : "Haz click para seleccionar archivo"}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            PDF, imágenes o documentos
          </p>

        </div>

      </label>

      <button
        onClick={upload}
        disabled={!file || loading}
        className="
          mt-4
          w-full
          bg-emerald-600
          text-white
          py-3
          rounded-xl
          hover:bg-emerald-700
          transition
          disabled:opacity-50
        "
      >

        {loading
          ? "Subiendo..."
          : "Subir documento"}

      </button>

    </div>

  )
}