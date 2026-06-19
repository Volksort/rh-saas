import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CreateEmployeeModal from "@/components/CreateEmployeeModal";
import EmployeeListClient from "@/components/EmployeeListClient";

export default async function EmployeesPage() {
  // OJO: aquí ya no usamos session como filtro
  const departments = await prisma.department.findMany({
    include: { employees: true },
    orderBy: { name: "asc" },
  });

  // si quieres seguridad, puedes sacar companyId del primer depto
  const companyId = departments[0]?.companyId;

  if (!companyId) notFound();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Todos los empleados
          </h1>

          <CreateEmployeeModal
            companyId={companyId}
            departments={departments}
          />
        </div>

        <EmployeeListClient departments={departments} />

      </div>
    </div>
  );
}