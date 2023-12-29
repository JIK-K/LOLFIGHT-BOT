/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Team_Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Team_Member_name_key` ON `Team_Member`(`name`);
