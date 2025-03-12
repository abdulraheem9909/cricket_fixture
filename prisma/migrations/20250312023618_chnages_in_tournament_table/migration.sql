/*
  Warnings:

  - A unique constraint covering the columns `[teamId,weekNumber]` on the table `HomeGroundAvailability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,weekNumber]` on the table `OffRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Tournament` ADD COLUMN `tournamentOffWeek` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `HomeGroundAvailability_teamId_weekNumber_key` ON `HomeGroundAvailability`(`teamId`, `weekNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `OffRequest_teamId_weekNumber_key` ON `OffRequest`(`teamId`, `weekNumber`);
