/*
  Warnings:

  - You are about to drop the column `lightID` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `pumpID` on the `device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deviceID]` on the table `led_light` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deviceID]` on the table `pump` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceID` to the `led_light` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceID` to the `pump` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `light_ibfk_1`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `pump_ibfk_1`;

-- DropIndex
DROP INDEX `device_lightID_key` ON `device`;

-- DropIndex
DROP INDEX `device_pumpID_key` ON `device`;

-- AlterTable
ALTER TABLE `device` DROP COLUMN `lightID`,
    DROP COLUMN `pumpID`;

-- AlterTable
ALTER TABLE `led_light` ADD COLUMN `deviceID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pump` ADD COLUMN `deviceID` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `led_light_deviceID_key` ON `led_light`(`deviceID`);

-- CreateIndex
CREATE UNIQUE INDEX `pump_deviceID_key` ON `pump`(`deviceID`);

-- AddForeignKey
ALTER TABLE `led_light` ADD CONSTRAINT `led_light_deviceID_fkey` FOREIGN KEY (`deviceID`) REFERENCES `device`(`deviceID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pump` ADD CONSTRAINT `pump_deviceID_fkey` FOREIGN KEY (`deviceID`) REFERENCES `device`(`deviceID`) ON DELETE RESTRICT ON UPDATE CASCADE;
