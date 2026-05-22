/*
  Warnings:

  - You are about to drop the column `driveFolder` on the `Employee` table. All the data in the column will be lost.
  - The `status` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COMPANY_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "driveFolderId" TEXT,
ADD COLUMN     "driveFolderUrl" TEXT;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "driveFileId" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "uploaded" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "driveUrl" DROP NOT NULL,
ALTER COLUMN "uploadedAt" DROP NOT NULL,
ALTER COLUMN "uploadedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "driveFolder",
ADD COLUMN     "driveFolderId" TEXT,
ADD COLUMN     "driveFolderUrl" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
