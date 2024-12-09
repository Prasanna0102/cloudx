/*
  Warnings:

  - The primary key for the `BuildLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BuildTask` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BuildLog" DROP CONSTRAINT "BuildLog_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BuildLog_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BuildLog_id_seq";

-- AlterTable
ALTER TABLE "BuildTask" DROP CONSTRAINT "BuildTask_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BuildTask_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BuildTask_id_seq";
