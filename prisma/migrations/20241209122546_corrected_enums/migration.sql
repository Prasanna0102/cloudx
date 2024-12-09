/*
  Warnings:

  - The values [QUEUED,IN_PROGRESS,COMPLETED,FAILED,CANCELLED,TIMED_OUT,RETRYING] on the enum `BuildTaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,COMPLETED,FAILED,ROLLED_BACK,DEACTIVATED] on the enum `DeploymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREATED,BUILDING,DEPLOYED,FAILED,SAVED,ARCHIVED] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,MEMBER] on the enum `TeamRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Domain` on the `Deployment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Deployment` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BuildTaskStatus_new" AS ENUM ('Queued', 'InProgress', 'Completed', 'Failed', 'Cancelled', 'TimedOut', 'Retrying');
ALTER TABLE "BuildTask" ALTER COLUMN "status" TYPE "BuildTaskStatus_new" USING ("status"::text::"BuildTaskStatus_new");
ALTER TYPE "BuildTaskStatus" RENAME TO "BuildTaskStatus_old";
ALTER TYPE "BuildTaskStatus_new" RENAME TO "BuildTaskStatus";
DROP TYPE "BuildTaskStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DeploymentStatus_new" AS ENUM ('Pending', 'InProgress', 'Completed', 'Failed', 'RolledBack', 'Deactivated');
ALTER TABLE "Deployment" ALTER COLUMN "status" TYPE "DeploymentStatus_new" USING ("status"::text::"DeploymentStatus_new");
ALTER TYPE "DeploymentStatus" RENAME TO "DeploymentStatus_old";
ALTER TYPE "DeploymentStatus_new" RENAME TO "DeploymentStatus";
DROP TYPE "DeploymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('Created', 'Building', 'Deployed', 'Failed', 'Saved', 'Archived');
ALTER TABLE "Project" ALTER COLUMN "status" TYPE "ProjectStatus_new" USING ("status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "ProjectStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TeamRole_new" AS ENUM ('Admin', 'Member');
ALTER TABLE "TeamMember" ALTER COLUMN "role" TYPE "TeamRole_new" USING ("role"::text::"TeamRole_new");
ALTER TYPE "TeamRole" RENAME TO "TeamRole_old";
ALTER TYPE "TeamRole_new" RENAME TO "TeamRole";
DROP TYPE "TeamRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "BuildTask" ALTER COLUMN "status" SET DEFAULT 'Queued';

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "Domain",
DROP COLUMN "name",
ADD COLUMN     "domain" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'Created';

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
