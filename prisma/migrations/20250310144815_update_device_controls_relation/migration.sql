-- DropForeignKey
ALTER TABLE `controls` DROP FOREIGN KEY `controls_ibfk_device`;

-- DropForeignKey
ALTER TABLE `controls` DROP FOREIGN KEY `controls_ibfk_sensor`;

-- DropIndex
DROP INDEX `deviceID` ON `controls`;

-- DropIndex
DROP INDEX `sensorID` ON `controls`;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_device` FOREIGN KEY (`deviceID`) REFERENCES `device`(`deviceID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_sensor` FOREIGN KEY (`sensorID`) REFERENCES `sensor`(`sensorID`) ON DELETE SET NULL ON UPDATE NO ACTION;
