/*
 * File: database-init-script.sql
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 10:54:38 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Wednesday, 24th October 2018 12:25:20 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */




CREATE TABLE `issuer` (
	`id` INT NOT NULL,
	`web_page` varchar(500) NOT NULL,
	`api_secret` varchar(256) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `user` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` varchar(100) NOT NULL UNIQUE,
	`password_hash` varchar(256) NOT NULL,
	`name` varchar(100) NOT NULL,
	`public_key` varchar(256),
	`trusted_by_system_at` DATETIME,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`description` varchar(500),
	`role` INT NOT NULL,
	`skills` varchar(500),
	PRIMARY KEY (`id`)
);

CREATE TABLE `published_cert` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`issuer_id` INT NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`description` varchar(500) NOT NULL,
	`title` varchar(100) NOT NULL,
	`badge_icon` varchar(200),
	PRIMARY KEY (`id`)
);

CREATE TABLE `request_cert` (
	`published_cert_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` INT NOT NULL,
	PRIMARY KEY (`published_cert_id`,`user_id`)
);

CREATE TABLE `job` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`quantity` INT NOT NULL,
	`deadline` DATETIME NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`title` varchar(100) NOT NULL,
	`description` TEXT NOT NULL,
	`applicants` INT,
	`rejected_applicants` INT,
	`accepted_applicants` INT,
	`location` varchar(100) NOT NULL,
	`skills` varchar(500) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `apply_job` (
	`job_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` INT NOT NULL,
	PRIMARY KEY (`job_id`,`user_id`)
);

CREATE TABLE `issuer_member` (
	`issuer_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`issuer_system_identifier` varchar(100) NOT NULL,
	PRIMARY KEY (`issuer_id`,`user_id`)
);

CREATE TABLE `user_skill` (
	`user_id` INT NOT NULL,
	`skill_id` INT NOT NULL,
	PRIMARY KEY (`user_id`,`skill_id`)
);

CREATE TABLE `skill` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `job_skill` (
	`job_id` INT NOT NULL,
	`skill_id` INT NOT NULL,
	PRIMARY KEY (`job_id`,`skill_id`)
);

ALTER TABLE `issuer` ADD CONSTRAINT `issuer_fk0` FOREIGN KEY (`id`) REFERENCES `user`(`id`);

ALTER TABLE `published_cert` ADD CONSTRAINT `published_cert_fk0` FOREIGN KEY (`issuer_id`) REFERENCES `issuer`(`id`);

ALTER TABLE `request_cert` ADD CONSTRAINT `request_cert_fk0` FOREIGN KEY (`published_cert_id`) REFERENCES `published_cert`(`id`);

ALTER TABLE `request_cert` ADD CONSTRAINT `request_cert_fk1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `job` ADD CONSTRAINT `job_fk0` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `apply_job` ADD CONSTRAINT `apply_job_fk0` FOREIGN KEY (`job_id`) REFERENCES `job`(`id`);

ALTER TABLE `apply_job` ADD CONSTRAINT `apply_job_fk1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `issuer_member` ADD CONSTRAINT `issuer_member_fk0` FOREIGN KEY (`issuer_id`) REFERENCES `issuer`(`id`);

ALTER TABLE `issuer_member` ADD CONSTRAINT `issuer_member_fk1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `user_skill` ADD CONSTRAINT `user_skill_fk0` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `user_skill` ADD CONSTRAINT `user_skill_fk1` FOREIGN KEY (`skill_id`) REFERENCES `skill`(`id`);

ALTER TABLE `job_skill` ADD CONSTRAINT `job_skill_fk0` FOREIGN KEY (`job_id`) REFERENCES `job`(`id`);

ALTER TABLE `job_skill` ADD CONSTRAINT `job_skill_fk1` FOREIGN KEY (`skill_id`) REFERENCES `skill`(`id`);

