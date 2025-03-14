-- AlterTable
ALTER TABLE `controls` ADD COLUMN `sensorID` INTEGER NULL,
    MODIFY `deviceID` INTEGER NULL,
    MODIFY `action` VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE INDEX `sensorID` ON `controls`(`sensorID`);

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_device` FOREIGN KEY (`deviceID`) REFERENCES `device`(`deviceID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_sensor` FOREIGN KEY (`sensorID`) REFERENCES `sensor`(`sensorID`) ON DELETE CASCADE ON UPDATE NO ACTION;
