import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: companyId } = await params;

  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) notFound();

  const logs = await prisma.activityLog.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-white">
          Logs de {company.name}
        </h1>

        {logs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            No hay registros
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
              >
                <p className="font-semibold">
                  {log.description}
                </p>

                <p className="text-sm text-gray-500">
                  Usuario: {log.userName || "Sistema"}
                </p>

                <p className="text-sm text-gray-500">
                  Acción: {log.action}
                </p>

                <p className="text-sm text-gray-500">
                  Tipo: {log.entityType}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}