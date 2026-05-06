"use client"

import { useState } from "react"

export default function Employees(){

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [phone,setPhone] = useState("")
  const [position,setPosition] = useState("")

  async function createEmployee(){

    await fetch("/api/employees",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        phone,
        position,
        companyId:"cmmmw2iv90000r4nkpheslzzn",
        departmentId:"cmmmxjx330004r4nk3xyrmmwf"
      })
    })

    alert("Empleado creado")
  }

  return(

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Crear empleado
      </h1>

      <div className="flex flex-col gap-4 w-96">

        <input
        placeholder="Nombre"
        className="border p-2"
        onChange={(e)=>setName(e.target.value)}
        />

        <input
        placeholder="Email"
        className="border p-2"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input
        placeholder="Telefono"
        className="border p-2"
        onChange={(e)=>setPhone(e.target.value)}
        />

        <input
        placeholder="Puesto"
        className="border p-2"
        onChange={(e)=>setPosition(e.target.value)}
        />

        <button
        onClick={createEmployee}
        className="bg-emerald-600 text-white p-2 rounded"
        >
        Crear empleado
        </button>

      </div>

    </div>

  )
}