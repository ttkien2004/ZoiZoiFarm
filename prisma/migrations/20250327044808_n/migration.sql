/*
  Warnings:

  - You are about to drop the column `led_lightID` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `pumpPumpID` on the `device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lightID]` on the table `device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pumpID]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_led_lightID_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_pumpPumpID_fkey`;

-- DropIndex
DROP INDEX `device_led_lightID_fkey` ON `device`;

-- DropIndex
DROP INDEX `device_pumpPumpID_fkey` ON `device`;

-- AlterTable
ALTER TABLE `device` DROP COLUMN `led_lightID`,
    DROP COLUMN `pumpPumpID`,
    ADD COLUMN `lightID` INTEGER NULL,
    ADD COLUMN `pumpID` INTEGER NULL;

-- CreateIndex
CREATE INDEX `dataTime` ON `data`(`dataTime`);

-- CreateIndex
CREATE UNIQUE INDEX `device_lightID_key` ON `device`(`lightID`);

-- CreateIndex
CREATE UNIQUE INDEX `device_pumpID_key` ON `device`(`pumpID`);

-- CreateIndex
CREATE INDEX `sensorID` ON `sensor`(`sensorID`);

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `light_ibfk_1` FOREIGN KEY (`lightID`) REFERENCES `led_light`(`lightID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `pump_ibfk_1` FOREIGN KEY (`pumpID`) REFERENCES `pump`(`pumpID`) ON DELETE SET NULL ON UPDATE NO ACTION;
