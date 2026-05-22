import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateEmployeeModal from "@/components/CreateEmployeeModal";
import EmployeeListClient from "@/components/EmployeeListClient";

export default async function EmployeesPageByCompany({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: companyIdFromUrl } = await params;
  const session = await getServerSession(authOptions);
  const userCompanyId = session?.user?.companyId;
  const userRole = session?.user?.role;

  // Solo ADMIN puede ver empresas ajenas
  const isAdmin = userRole === "ADMIN";
  const companyId = isAdmin ? companyIdFromUrl : userCompanyId;

  if (!companyId) notFound();

  // Verificar que la empresa exista
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });
  if (!company) notFound();

  const departments = await prisma.department.findMany({
    where: { companyId },
    include: { employees: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Empleados de {company.name}
          </h1>
          <CreateEmployeeModal companyId={companyId} departments={departments} />
        </div>
        <EmployeeListClient departments={departments} />
      </div>
    </div>
  );
}