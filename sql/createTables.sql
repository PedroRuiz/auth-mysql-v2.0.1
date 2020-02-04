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