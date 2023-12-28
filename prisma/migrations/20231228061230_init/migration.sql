-- AlterTable
ALTER TABLE `Member` MODIFY `team` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Team` MODIFY `numberMembers` INTEGER NOT NULL DEFAULT 0;
