"use client"

import { useState, useEffect } from "react"

export default function DepartmentsPage() {

  const [name, setName] = useState("")
  const [companyId, setCompanyId] = useState("")

  useEffect(() => {

    const getSession = async () => {

      const res = await fetch("/api/auth/session")
      const session = await res.json()

      if (session?.user?.companyId) {
        setCompanyId(session.user.companyId)
      }

    }

    getSession()

  }, [])

  const createDepartment = async () => {

    if (!name) {
      alert("Escribe un nombre")
      return
    }

    await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        companyId
      })
    })

    alert("Departamento creado")

    setName("")
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold">
        Crear Departamento
      </h1>

      <div className="mt-6 flex flex-col gap-4 max-w-md">

        <input
          className="border p-2 rounded"
          placeholder="Nombre del departamento"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* COMPANY ID AUTOMÁTICO */}

        <input
          className="border p-2 rounded bg-gray-100"
          value={companyId}
          disabled
        />

        <button
          onClick={createDepartment}
          className="bg-emerald-600 text-white p-2 rounded"
        >
          Crear
        </button>

      </div>

    </div>
  )
}