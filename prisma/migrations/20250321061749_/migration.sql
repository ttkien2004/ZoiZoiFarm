/*
  Warnings:

  - You are about to drop the `warning_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `led_light` DROP FOREIGN KEY `led_light_ibfk_1`;

-- DropForeignKey
ALTER TABLE `pump` DROP FOREIGN KEY `pump_ibfk_1`;

-- AlterTable
ALTER TABLE `controls` MODIFY `userID` INTEGER NULL;

-- AlterTable
ALTER TABLE `device` ADD COLUMN `led_lightID` INTEGER NULL,
    ADD COLUMN `pumpPumpID` INTEGER NULL,
    ADD COLUMN `userID` INTEGER NULL;

-- AlterTable
ALTER TABLE `sensor` ADD COLUMN `userID` INTEGER NULL;

-- AlterTable
ALTER TABLE `warning` ADD COLUMN `userID` INTEGER NULL;

-- DropTable
DROP TABLE `warning_user`;

-- CreateIndex
CREATE INDEX `userID` ON `controls`(`userID`);

-- CreateIndex
CREATE INDEX `userID` ON `device`(`userID`);

-- CreateIndex
CREATE INDEX `userID` ON `sensor`(`userID`);

-- CreateIndex
CREATE INDEX `FK_user_warning` ON `warning`(`userID`);

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `data` ADD CONSTRAINT `FK_sensor_id` FOREIGN KEY (`sensorID`) REFERENCES `sensor`(`sensorID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_led_lightID_fkey` FOREIGN KEY (`led_lightID`) REFERENCES `led_light`(`lightID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_pumpPumpID_fkey` FOREIGN KEY (`pumpPumpID`) REFERENCES `pump`(`pumpID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sensor` ADD CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `warning` ADD CONSTRAINT `FK_sensor_warning` FOREIGN KEY (`sensorID`) REFERENCES `sensor`(`sensorID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `warning` ADD CONSTRAINT `FK_user_warning` FOREIGN KEY (`userID`) REFERENCES `user`(`userID`) ON DELETE CASCADE ON UPDATE NO ACTION;
