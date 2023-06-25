CREATE TABLE `city`(
    `city_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `city_name` TEXT NOT NULL
);
ALTER TABLE
    `city` ADD PRIMARY KEY `city_city_id_primary`(`city_id`);
CREATE TABLE `Beach`(
    `beach_id` INT NOT NULL,
    `beach_name` TEXT NOT NULL,
    `city_name` TEXT NOT NULL,
    `safeguard` TINYINT(1) NOT NULL,
    `declared` TINYINT(1) NOT NULL,
    `reserved` TINYINT(1) NOT NULL,
    `fishing` TINYINT(1) NOT NULL,
    `parking_price` DOUBLE NULL,
    `broadcast` TEXT NULL,
    `extra` LONGTEXT NULL
);
ALTER TABLE
    `Beach` ADD PRIMARY KEY `beach_beach_id_primary`(`beach_id`);
ALTER TABLE
    `Beach` ADD PRIMARY KEY `beach_beach_name_primary`(`beach_name`);
CREATE TABLE `Temp_data`(
    `wave_hight` DOUBLE NULL,
    `water_temp` DOUBLE NULL,
    `wind_dirction` ENUM('') NULL,
    `beach_id` BIGINT NOT NULL
);
ALTER TABLE
    `Temp_data` ADD PRIMARY KEY `temp_data_beach_id_primary`(`beach_id`);
CREATE TABLE `Registered_User`(
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `full_name` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `password` TEXT NOT NULL,
    `favorites_list` MULTIPOLYGON NOT NULL,
    `admin` TINYINT(1) NOT NULL,
    `city_name` TEXT NOT NULL
);
ALTER TABLE
    `Registered_User` ADD PRIMARY KEY `registered_user_user_id_primary`(`user_id`);
ALTER TABLE
    `Registered_User` ADD PRIMARY KEY `registered_user_email_primary`(`email`);
ALTER TABLE
    `Registered_User` ADD CONSTRAINT `registered_user_favorites_list_foreign` FOREIGN KEY(`favorites_list`) REFERENCES `Beach`(`beach_name`);
ALTER TABLE
    `Beach` ADD CONSTRAINT `beach_city_name_foreign` FOREIGN KEY(`city_name`) REFERENCES `city`(`city_name`);
ALTER TABLE
    `Registered_User` ADD CONSTRAINT `registered_user_city_name_foreign` FOREIGN KEY(`city_name`) REFERENCES `city`(`city_name`);
ALTER TABLE
    `Temp_data` ADD CONSTRAINT `temp_data_beach_id_foreign` FOREIGN KEY(`beach_id`) REFERENCES `Beach`(`beach_id`);