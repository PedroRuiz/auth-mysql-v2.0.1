/**
* run this sql in your database
**/

CREATE TABLE `pedrorui_authorization`.`owners` (
  `idowners` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `deletion_token` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idowners`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


