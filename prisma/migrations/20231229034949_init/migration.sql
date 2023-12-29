/*
  Warnings:

  - You are about to drop the column `team` on the `Team_Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Team_Member` DROP COLUMN `team`,
    ADD COLUMN `teamName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Team_Member` ADD CONSTRAINT `Team_Member_teamName_fkey` FOREIGN KEY (`teamName`) REFERENCES `Team`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
