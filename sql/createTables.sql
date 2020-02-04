/**
* run this sql in your database
**/

CREATE TABLE `owners` (
  `idowners` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `deletion_token` varchar(255) NOT NULL,
  `uuid` char(36) NOT NULL,
  PRIMARY KEY (`idowners`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `unique_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `applicationsv2.0.1` (
  `idapplications` int(11) NOT NULL AUTO_INCREMENT,
  `idowners` int(11) NOT NULL,
  `appname` varchar(255) DEFAULT NULL,
  `creationdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `uuid` char(36) NOT NULL,
  `apikey` char(31) NOT NULL,
  PRIMARY KEY (`idapplications`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  UNIQUE KEY `apikey_UNIQUE` (`apikey`),
  UNIQUE KEY `id_app_name_UNIQUE` (`idowners`,`appname`),
  KEY `fk_applicationsv2.0.1_1_idx` (`idowners`),
  CONSTRAINT `fk_applicationsv2.0.1_1` FOREIGN KEY (`idowners`) REFERENCES `owners` (`idowners`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8

