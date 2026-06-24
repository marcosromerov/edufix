-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'pending');

-- AlterTable: add status to User
ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'active';

-- AlterTable: add imageBase64 to Incident
ALTER TABLE "Incident" ADD COLUMN "imageBase64" TEXT;
