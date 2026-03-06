export default function Dashboard(){

  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold">
        Panel RH
      </h1>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded shadow">
          Empleados
        </div>

        <div className="bg-white p-6 rounded shadow">
          Incidencias
        </div>

        <div className="bg-white p-6 rounded shadow">
          Departamentos
        </div>

      </div>

    </div>

  )
}