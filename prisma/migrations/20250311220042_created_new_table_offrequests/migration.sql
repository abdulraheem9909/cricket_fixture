/*
  Warnings:

  - You are about to drop the column `week` on the `HomeGroundAvailability` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `HomeGroundAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `HomeGroundAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekNumber` to the `HomeGroundAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HomeGroundAvailability` DROP COLUMN `week`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `weekNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Tournament` ADD COLUMN `isCompleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `OffRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weekNumber` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `teamId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OffRequest` ADD CONSTRAINT `OffRequest_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
