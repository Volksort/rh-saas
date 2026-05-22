import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import CreateDepartmentModal from "@/components/CreateDepartmentModal";
import DepartmentsModal from "@/components/DepartmentsModal";

export default async function CompanyPage() {
  const session = await getServerSession(authOptions);
  const companyId = session?.user?.companyId;

  if (!companyId) notFound();

  // Obtenemos la empresa con empleados (solo 5), departamentos (todos) y contadores
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      employees: { take: 5 },
      departments: { orderBy: { name: "asc" } }, // todos los departamentos, ordenados
      _count: {
        select: { employees: true, departments: true },
      },
    },
  });

  if (!company) notFound();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {company.name}
          </h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/employees"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded transition-colors"
            >
              Ver empleados
            </Link>
            <CreateDepartmentModal companyId={companyId} />
          </div>
        </div>

        {/* STATS con contador clickeable para departamentos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
            <p className="text-gray-500 dark:text-gray-400">Empleados</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {company._count.employees}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
            <p className="text-gray-500 dark:text-gray-400">Departamentos</p>
            {/* Contador clickeable que abre modal con todos los departamentos */}
            <DepartmentsModal departments={company.departments} />
          </div>
        </div>

        {/* LISTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Últimos empleados */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Últimos empleados
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              {company.employees.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay empleados aún.
                </div>
              ) : (
                company.employees.map((emp: any) => (
                  <div
                    key={emp.id}
                    className="p-4 border-b border-gray-100 dark:border-gray-700"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{emp.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{emp.email}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Últimos departamentos (vista previa de 5) */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Últimos departamentos
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              {company.departments.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay departamentos aún.
                </div>
              ) : (
                <>
                  {company.departments.slice(0, 5).map((dep: any) => (
                    <div
                      key={dep.id}
                      className="p-4 border-b border-gray-100 dark:border-gray-700"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{dep.name}</p>
                    </div>
                  ))}
                  {company.departments.length > 5 && (
                    <div className="p-4 text-center">
                      <button
                        onClick={() => {
                          // Disparar el clic en el botón del contador (que está en el componente DepartmentsModal)
                          const modalButton = document.querySelector(
                            ".departments-modal-trigger"
                          ) as HTMLButtonElement;
                          if (modalButton) modalButton.click();
                        }}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
                      >
                        Ver todos ({company._count.departments})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}