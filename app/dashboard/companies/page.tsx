"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Companies(){

  const [companies,setCompanies] = useState<any[]>([])
  const [name,setName] = useState("")
  const [showModal,setShowModal] = useState(false)

  const router = useRouter()

  async function loadCompanies(){

    const res = await fetch("/api/companies")
    const data = await res.json()

    setCompanies(data)

  }

  useEffect(()=>{
    loadCompanies()
  },[])


  async function createCompany(){

    await fetch("/api/companies",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ name })
    })

    setShowModal(false)
    setName("")

    loadCompanies()
  }

  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Empresas
      </h1>

      <div className="grid grid-cols-2 gap-10">

        {/* PANEL IZQUIERDO */}

        <div>

          <div className="flex justify-between mb-6">

            <h2 className="text-xl font-semibold">
              Lista de empresas
            </h2>

            <button
              onClick={()=>setShowModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
            >
              + Crear empresa
            </button>

          </div>


          <div className="bg-white rounded shadow">

            {companies.map((company)=>(
              
              <div
                key={company.id}
                className="p-4 border-b flex justify-between items-center"
              >

                <div>

                  <p className="font-medium">
                    {company.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {company.employees.length} empleados
                  </p>

                </div>

                <button
                  onClick={()=>router.push(`/dashboard/company/${company.id}`)}
                  className="text-sm bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                  Ver empresa
                </button>

              </div>

            ))}

          </div>

        </div>


        {/* PANEL DERECHO */}

        <div>

          <h2 className="text-xl font-semibold mb-6">
            Información empresa
          </h2>

          <div className="bg-white p-6 rounded shadow">

            <select className="border border-gray-300 p-2 w-full mb-6 rounded">

              <option>Seleccionar empresa</option>

              {companies.map((company)=>(
                <option key={company.id}>
                  {company.name}
                </option>
              ))}

            </select>

            <p className="text-gray-500">
              Rotación de empleados (próximamente)
            </p>

          </div>

        </div>

      </div>


      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white text-black p-8 rounded-xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              Crear empresa
            </h2>

            <input
              placeholder="Nombre empresa"
              className="border border-gray-300 p-2 w-full mb-4 rounded"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={createCompany}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
              >
                Crear
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}