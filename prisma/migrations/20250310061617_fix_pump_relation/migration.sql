/*
  Warnings:

  - The primary key for the `controls` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deviceID` on the `led_light` table. All the data in the column will be lost.
  - You are about to drop the column `deviceID` on the `pump` table. All the data in the column will be lost.
  - Added the required column `controlID` to the `controls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `deviceID` ON `led_light`;

-- DropIndex
DROP INDEX `deviceID` ON `pump`;

-- AlterTable
ALTER TABLE `controls` DROP PRIMARY KEY,
    ADD COLUMN `controlID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`controlID`);

-- AlterTable
ALTER TABLE `led_light` DROP COLUMN `deviceID`,
    MODIFY `lightID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pump` DROP COLUMN `deviceID`,
    MODIFY `pumpID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `led_light` ADD CONSTRAINT `led_light_ibfk_1` FOREIGN KEY (`lightID`) REFERENCES `device`(`deviceID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pump` ADD CONSTRAINT `pump_ibfk_1` FOREIGN KEY (`pumpID`) REFERENCES `device`(`deviceID`) ON DELETE CASCADE ON UPDATE NO ACTION;
