import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "UPLOAD" | "ACTIVATE" | "DEACTIVATE";
type EntityType = "EMPLOYEE" | "DEPARTMENT" | "DOCUMENT" | "INCIDENT";

interface AuditLogParams {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  changes?: any;
  companyId: string;
}

/**
 * Crea un registro de auditoría automáticamente usando la sesión actual.
 * Llama a esta función desde cualquier API route o server action.
 */
export async function createAuditLog(params: AuditLogParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn("Intento de auditoría sin sesión");
      return;
    }

    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        changes: params.changes ? JSON.parse(JSON.stringify(params.changes)) : null,
        userId: session.user.id,
        userEmail: session.user.email || "",
        userName: session.user.name || "",
        companyId: params.companyId,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error al crear log de auditoría:", error);
    // No interrumpimos la operación principal
  }
}