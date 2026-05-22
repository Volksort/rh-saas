import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UploadDocument from "@/components/UploadDocument";
import UpdateDocumentButton from "@/components/UpdateDocumentButton";
import DeleteDocumentButton from "@/components/DeleteDocumentButton"; // 👈 Importa el botón
import Link from "next/link";

export default async function Employee({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      documents: true,
      department: true,
      company: true,
      incidents: true,
    },
  });

  if (!employee) notFound();

  const requiredDocuments = ["INE", "RFC", "CURP", "CONTRATO", "NSS"];
  const uploadedTypes = employee.documents.map((doc) => doc.type);
  const completedCount = requiredDocuments.filter((doc) => uploadedTypes.includes(doc)).length;
  const progressPercent = (completedCount / requiredDocuments.length) * 100;
  const sortedDocs = [...employee.documents].sort(
    (a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Información del empleado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{employee.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{employee.position || "Sin puesto asignado"}</p>
            </div>
            <Link
              href="/dashboard/employees"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
              ← Volver a empleados
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold">Email</p>
              <p>{employee.email}</p>
            </div>
            <div>
              <p className="font-semibold">Teléfono</p>
              <p>{employee.phone || "No especificado"}</p>
            </div>
            <div>
              <p className="font-semibold">Departamento</p>
              <p>{employee.department?.name || "Sin departamento"}</p>
            </div>
            <div>
              <p className="font-semibold">Empresa</p>
              <p>{employee.company.name}</p>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Documentos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <UploadDocument employeeId={employee.id} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Documentos requeridos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {requiredDocuments.map((doc) => {
                    const exists = uploadedTypes.includes(doc);
                    return (
                      <div
                        key={doc}
                        className={`rounded-lg border p-2 flex items-center gap-2 text-sm ${
                          exists
                            ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20"
                            : "bg-red-50 border-red-300 dark:bg-red-900/20"
                        }`}
                      >
                        <span>{exists ? "✅" : "❌"}</span>
                        <span className="font-medium">{doc}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {completedCount} de {requiredDocuments.length} documentos completados
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Últimos documentos</h3>
                {employee.documents.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay documentos subidos</p>
                ) : (
                  <ul className="space-y-3">
                    {sortedDocs.slice(0, 3).map((doc) => (
                      <li key={doc.id} className="border-b pb-2">
                        <div className="flex items-center gap-2">
                          <span>📄</span>
                          <div>
                            <p className="text-sm font-medium">{doc.type === "OTRO" ? doc.name : doc.type}</p>
                            <p className="text-xs text-gray-500">
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Fecha no disponible"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                    {employee.documents.length > 3 && (
                      <li className="text-xs text-emerald-600 text-center mt-2">+ {employee.documents.length - 3} más</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Todos los documentos</h3>
            {employee.documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl">No hay documentos subidos</div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {sortedDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium">{doc.type === "OTRO" ? doc.name : `${doc.type} - ${doc.name}`}</p>
                        <p className="text-xs text-gray-500">Tipo: {doc.type === "OTRO" ? "Otro documento" : doc.type}</p>
                        <p className="text-xs text-gray-400">
                          Subido: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Fecha desconocida"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {doc.driveUrl && (
                        <a href={doc.driveUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-3 py-1 rounded text-sm">
                          Ver
                        </a>
                      )}
                      <UpdateDocumentButton documentId={doc.id} employeeId={employee.id} />
                      <DeleteDocumentButton documentId={doc.id} employeeId={employee.id}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}