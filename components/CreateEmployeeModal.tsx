"use client"

import { useState } from "react"

type Department = {
  id: string
  name: string
}

export default function CreateEmployeeModal({
  companyId,
  departments
}: {
  companyId: string
  departments: Department[]
}) {

  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState("")
  const [departmentId, setDepartmentId] = useState("")

  const [loading, setLoading] = useState(false)

  async function createEmployee() {

    if (!name || !email || !departmentId) {
      alert("Completa los campos")
      return
    }

    setLoading(true)

    await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        position,
        companyId,
        departmentId
      })
    })

    setLoading(false)

    setOpen(false)

    location.reload()
  }

  return (

    <>

      {/* BOTÓN */}

      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
      >
        Crear empleado
      </button>

      {/* MODAL */}

      {open && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">

            <h2 className="text-2xl font-bold mb-6">
              Nuevo empleado
            </h2>

            <div className="flex flex-col gap-4">

              <input
                placeholder="Nombre"
                className="border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="Teléfono"
                className="border p-2 rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                placeholder="Puesto"
                className="border p-2 rounded"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />

              {/* SELECT DEPARTAMENTOS */}

              <select
                className="border p-2 rounded"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >

                <option value="">
                  Selecciona un departamento
                </option>

                {departments.map((department) => (

                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>

                ))}

              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={createEmployee}
                disabled={loading}
                className="bg-emerald-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Creando..." : "Crear empleado"}
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  )
}