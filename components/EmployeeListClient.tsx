"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Employee = {
  id: string;
  name: string;
  email: string | null;
};

type Department = {
  id: string;
  name: string;
  employees: Employee[];
};

export default function EmployeeListClient({
  departments: initialDepartments,
}: {
  departments: Department[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return initialDepartments;
    const term = searchTerm.trim().toLowerCase();
    return initialDepartments
      .map((dept) => ({
        ...dept,
        employees: dept.employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(term) ||
            (emp.email && emp.email.toLowerCase().includes(term))
        ),
      }))
      .filter((dept) => dept.employees.length > 0);
  }, [initialDepartments, searchTerm]);

  const hasResults = filteredDepartments.length > 0;

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
      </div>

      {!hasResults && searchTerm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center mb-6">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron empleados que coincidan con "{searchTerm}"
          </p>
        </div>
      )}

      {!hasResults && !searchTerm && initialDepartments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center mb-6">
          <p className="text-gray-500 dark:text-gray-400">
            No hay departamentos ni empleados aún.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {filteredDepartments.map((department) => (
          <div
            key={department.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
              {department.name} ({department.employees.length})
            </h2>

            {department.employees.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No hay empleados en este departamento que coincidan con la búsqueda
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.employees.map((employee) => (
                  <Link
                    href={`/dashboard/employee/${employee.id}`}
                    key={employee.id}
                    className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                  >
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      {employee.name}
                    </p>
                    {employee.email && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {employee.email}
                      </p>
                    )}
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      {department.name}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
