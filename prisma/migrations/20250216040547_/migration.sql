/*
  Warnings:

  - Added the required column `numTeams` to the `Division` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Division` ADD COLUMN `numTeams` INTEGER NOT NULL;
