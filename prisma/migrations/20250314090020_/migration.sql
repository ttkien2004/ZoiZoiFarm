-- CreateTable
CREATE TABLE `controls` (
    `controlID` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `deviceID` INTEGER NULL,
    `sensorID` INTEGER NULL,
    `timeSwitch` DATETIME(0) NOT NULL,
    `action` VARCHAR(200) NOT NULL,

    INDEX `controlID`(`controlID`),
    PRIMARY KEY (`controlID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data` (
    `dataID` INTEGER NOT NULL AUTO_INCREMENT,
    `sensorID` INTEGER NOT NULL,
    `dataTime` DATETIME(0) NOT NULL,
    `value` FLOAT NOT NULL,

    INDEX `sensorID`(`sensorID`),
    PRIMARY KEY (`dataID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device` (
    `deviceID` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceName` VARCHAR(50) NOT NULL,
    `quantity` INTEGER NULL,
    `status` ENUM('able', 'disable') NOT NULL,

    PRIMARY KEY (`deviceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `led_light` (
    `lightID` INTEGER NOT NULL,
    `state` ENUM('on', 'off') NOT NULL,

    PRIMARY KEY (`lightID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pump` (
    `pumpID` INTEGER NOT NULL,
    `autoLevel` BOOLEAN NOT NULL,
    `schedule` VARCHAR(255) NULL,
    `state` ENUM('on', 'off', 'auto') NOT NULL,

    PRIMARY KEY (`pumpID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensor` (
    `sensorID` INTEGER NOT NULL AUTO_INCREMENT,
    `sensorName` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NULL,
    `quantity` INTEGER NULL,
    `alertThreshold` FLOAT NULL,
    `status` ENUM('able', 'disable') NOT NULL,

    PRIMARY KEY (`sensorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(50) NULL,
    `lastName` VARCHAR(50) NULL,
    `phoneNum` VARCHAR(15) NULL,
    `email` VARCHAR(100) NULL,

    UNIQUE INDEX `userName`(`userName`),
    UNIQUE INDEX `phoneNum`(`phoneNum`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warning` (
    `warningID` INTEGER NOT NULL AUTO_INCREMENT,
    `sensorID` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `timeWarning` DATETIME(0) NOT NULL,

    INDEX `sensorID`(`sensorID`),
    PRIMARY KEY (`warningID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warning_user` (
    `warningID` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,

    INDEX `userID`(`userID`),
    PRIMARY KEY (`warningID`, `userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_device` FOREIGN KEY (`deviceID`) REFERENCES `device`(`deviceID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_sensor` FOREIGN KEY (`sensorID`) REFERENCES `sensor`(`sensorID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `led_light` ADD CONSTRAINT `led_light_ibfk_1` FOREIGN KEY (`lightID`) REFERENCES `device`(`deviceID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pump` ADD CONSTRAINT `pump_ibfk_1` FOREIGN KEY (`pumpID`) REFERENCES `device`(`deviceID`) ON DELETE CASCADE ON UPDATE NO ACTION;
