-- CreateTable
CREATE TABLE `controls` (
    `userID` INTEGER NOT NULL,
    `deviceID` INTEGER NOT NULL,
    `timeSwitch` DATETIME(0) NOT NULL,
    `action` VARCHAR(50) NOT NULL,

    INDEX `deviceID`(`deviceID`),
    PRIMARY KEY (`userID`, `deviceID`)
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
    `lightID` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceID` INTEGER NOT NULL,
    `state` ENUM('on', 'off') NOT NULL,

    INDEX `deviceID`(`deviceID`),
    PRIMARY KEY (`lightID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pump` (
    `pumpID` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceID` INTEGER NOT NULL,
    `autoLevel` BOOLEAN NOT NULL,
    `schedule` VARCHAR(255) NULL,
    `state` ENUM('on', 'off', 'auto') NOT NULL,

    INDEX `deviceID`(`deviceID`),
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
