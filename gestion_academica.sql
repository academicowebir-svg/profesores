-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_academica
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asignacion_tutores`
--

DROP TABLE IF EXISTS `asignacion_tutores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignacion_tutores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tutor_id` int NOT NULL,
  `curso` varchar(50) NOT NULL,
  `paralelo` varchar(10) NOT NULL,
  `anio_lectivo` varchar(20) DEFAULT '2026-2027',
  `school_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tutor_curso` (`tutor_id`,`curso`,`paralelo`,`anio_lectivo`,`school_id`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `asignacion_tutores_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `tutores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignacion_tutores_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignacion_tutores`
--

LOCK TABLES `asignacion_tutores` WRITE;
/*!40000 ALTER TABLE `asignacion_tutores` DISABLE KEYS */;
INSERT INTO `asignacion_tutores` VALUES (1,1,'Tercero','A','2026-2027',1,'2026-08-24 00:08:10');
/*!40000 ALTER TABLE `asignacion_tutores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencia_recuperacion`
--

DROP TABLE IF EXISTS `asistencia_recuperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia_recuperacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estudiante_id` int NOT NULL,
  `materia_id` int NOT NULL,
  `docente_id` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('presente','ausente','atraso') DEFAULT 'presente',
  `observaciones` text,
  `school_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_asistencia` (`estudiante_id`,`materia_id`,`fecha`),
  KEY `materia_id` (`materia_id`),
  KEY `docente_id` (`docente_id`),
  CONSTRAINT `asistencia_recuperacion_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `asistencia_recuperacion_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `asistencia_recuperacion_ibfk_3` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia_recuperacion`
--

LOCK TABLES `asistencia_recuperacion` WRITE;
/*!40000 ALTER TABLE `asistencia_recuperacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistencia_recuperacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_id` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('presente','ausente','atraso') DEFAULT 'presente',
  `comentario` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_asistencia` (`grupo_id`,`fecha`),
  KEY `idx_asistencias_grupo_fecha` (`grupo_id`,`fecha`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=296 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,5,'2026-08-18','ausente',NULL,'2026-08-20 22:55:41'),(2,5,'2026-08-19','ausente',NULL,'2026-08-20 22:55:41'),(3,5,'2026-08-20','ausente','gdfgdfg','2026-08-20 22:55:41'),(4,5,'2026-08-21','presente',NULL,'2026-08-20 22:55:41'),(5,5,'2026-08-22','ausente',NULL,'2026-08-20 22:55:41'),(6,6,'2026-08-18','ausente','fdgdfg','2026-08-20 22:55:41'),(7,6,'2026-08-19','presente',NULL,'2026-08-20 22:55:41'),(8,6,'2026-08-20','ausente',NULL,'2026-08-20 22:55:41'),(9,6,'2026-08-21','presente',NULL,'2026-08-20 22:55:41'),(10,6,'2026-08-22','presente',NULL,'2026-08-20 22:55:41'),(11,7,'2026-08-18','presente',NULL,'2026-08-20 22:55:41'),(12,7,'2026-08-19','ausente','fgdfg','2026-08-20 22:55:41'),(13,7,'2026-08-20','presente',NULL,'2026-08-20 22:55:41'),(14,7,'2026-08-21','presente',NULL,'2026-08-20 22:55:41'),(15,7,'2026-08-22','presente',NULL,'2026-08-20 22:55:41'),(16,8,'2026-08-18','presente',NULL,'2026-08-20 22:55:41'),(17,8,'2026-08-19','presente',NULL,'2026-08-20 22:55:41'),(18,8,'2026-08-20','presente',NULL,'2026-08-20 22:55:41'),(19,8,'2026-08-21','presente',NULL,'2026-08-20 22:55:41'),(20,8,'2026-08-22','ausente','fdgfgdf','2026-08-20 22:55:41'),(41,5,'2026-08-25','presente',NULL,'2026-08-20 22:56:12'),(42,5,'2026-08-26','presente',NULL,'2026-08-20 22:56:12'),(43,5,'2026-08-27','presente',NULL,'2026-08-20 22:56:12'),(44,5,'2026-08-28','ausente',NULL,'2026-08-20 22:56:12'),(45,5,'2026-08-29','presente',NULL,'2026-08-20 22:56:12'),(46,6,'2026-08-25','ausente','fgdfg','2026-08-20 22:56:12'),(47,6,'2026-08-26','presente',NULL,'2026-08-20 22:56:12'),(48,6,'2026-08-27','presente',NULL,'2026-08-20 22:56:12'),(49,6,'2026-08-28','presente',NULL,'2026-08-20 22:56:12'),(50,6,'2026-08-29','presente',NULL,'2026-08-20 22:56:12'),(51,7,'2026-08-25','presente',NULL,'2026-08-20 22:56:12'),(52,7,'2026-08-26','ausente',NULL,'2026-08-20 22:56:12'),(53,7,'2026-08-27','presente',NULL,'2026-08-20 22:56:12'),(54,7,'2026-08-28','presente',NULL,'2026-08-20 22:56:12'),(55,7,'2026-08-29','presente',NULL,'2026-08-20 22:56:12'),(56,8,'2026-08-25','presente',NULL,'2026-08-20 22:56:12'),(57,8,'2026-08-26','presente',NULL,'2026-08-20 22:56:12'),(58,8,'2026-08-27','presente',NULL,'2026-08-20 22:56:12'),(59,8,'2026-08-28','presente',NULL,'2026-08-20 22:56:12'),(60,8,'2026-08-29','ausente','dgvdfgdf','2026-08-20 22:56:12'),(81,5,'2026-09-01','presente',NULL,'2026-08-23 23:24:38'),(82,5,'2026-09-02','presente',NULL,'2026-08-23 23:24:38'),(83,5,'2026-09-03','presente',NULL,'2026-08-23 23:24:38'),(84,5,'2026-09-04','presente',NULL,'2026-08-23 23:24:38'),(85,5,'2026-09-05','presente',NULL,'2026-08-23 23:24:38'),(86,6,'2026-09-01','ausente',NULL,'2026-08-23 23:24:38'),(87,6,'2026-09-02','presente',NULL,'2026-08-23 23:24:38'),(88,6,'2026-09-03','ausente',NULL,'2026-08-23 23:24:38'),(89,6,'2026-09-04','presente',NULL,'2026-08-23 23:24:38'),(90,6,'2026-09-05','presente',NULL,'2026-08-23 23:24:38'),(91,7,'2026-09-01','presente',NULL,'2026-08-23 23:24:38'),(92,7,'2026-09-02','presente',NULL,'2026-08-23 23:24:38'),(93,7,'2026-09-03','ausente',NULL,'2026-08-23 23:24:38'),(94,7,'2026-09-04','presente',NULL,'2026-08-23 23:24:38'),(95,7,'2026-09-05','presente',NULL,'2026-08-23 23:24:38'),(96,8,'2026-09-01','presente',NULL,'2026-08-23 23:24:38'),(97,8,'2026-09-02','presente',NULL,'2026-08-23 23:24:38'),(98,8,'2026-09-03','presente',NULL,'2026-08-23 23:24:38'),(99,8,'2026-09-04','presente',NULL,'2026-08-23 23:24:38'),(100,8,'2026-09-05','presente',NULL,'2026-08-23 23:24:38'),(121,13,'2026-08-18','presente',NULL,'2026-08-24 02:46:44'),(122,13,'2026-08-19','presente',NULL,'2026-08-24 02:46:44'),(123,13,'2026-08-20','presente',NULL,'2026-08-24 02:46:44'),(124,13,'2026-08-21','ausente',NULL,'2026-08-24 02:46:44'),(125,13,'2026-08-22','presente',NULL,'2026-08-24 02:46:44'),(126,14,'2026-08-18','ausente',NULL,'2026-08-24 02:46:44'),(127,14,'2026-08-19','ausente',NULL,'2026-08-24 02:46:44'),(128,14,'2026-08-20','ausente',NULL,'2026-08-24 02:46:44'),(129,14,'2026-08-21','presente',NULL,'2026-08-24 02:46:44'),(130,14,'2026-08-22','presente',NULL,'2026-08-24 02:46:44'),(131,15,'2026-08-18','ausente',NULL,'2026-08-24 02:46:44'),(132,15,'2026-08-19','presente',NULL,'2026-08-24 02:46:44'),(133,15,'2026-08-20','ausente',NULL,'2026-08-24 02:46:44'),(134,15,'2026-08-21','ausente',NULL,'2026-08-24 02:46:44'),(135,15,'2026-08-22','presente',NULL,'2026-08-24 02:46:44'),(136,16,'2026-08-18','presente',NULL,'2026-08-24 02:46:44'),(137,16,'2026-08-19','ausente',NULL,'2026-08-24 02:46:44'),(138,16,'2026-08-20','ausente',NULL,'2026-08-24 02:46:44'),(139,16,'2026-08-21','presente',NULL,'2026-08-24 02:46:44'),(140,16,'2026-08-22','presente',NULL,'2026-08-24 02:46:44'),(141,17,'2026-08-18','presente',NULL,'2026-08-24 02:46:44'),(142,17,'2026-08-19','presente',NULL,'2026-08-24 02:46:44'),(143,17,'2026-08-20','presente',NULL,'2026-08-24 02:46:44'),(144,17,'2026-08-21','presente',NULL,'2026-08-24 02:46:44'),(145,17,'2026-08-22','ausente',NULL,'2026-08-24 02:46:44'),(146,18,'2026-08-18','presente',NULL,'2026-08-24 02:46:55'),(147,18,'2026-08-19','ausente',NULL,'2026-08-24 02:46:55'),(148,18,'2026-08-20','presente',NULL,'2026-08-24 02:46:55'),(149,18,'2026-08-21','presente',NULL,'2026-08-24 02:46:55'),(150,18,'2026-08-22','presente',NULL,'2026-08-24 02:46:55'),(151,19,'2026-08-18','ausente',NULL,'2026-08-24 02:46:55'),(152,19,'2026-08-19','ausente',NULL,'2026-08-24 02:46:55'),(153,19,'2026-08-20','presente',NULL,'2026-08-24 02:46:55'),(154,19,'2026-08-21','presente',NULL,'2026-08-24 02:46:55'),(155,19,'2026-08-22','presente',NULL,'2026-08-24 02:46:55'),(156,20,'2026-08-18','ausente',NULL,'2026-08-24 02:46:55'),(157,20,'2026-08-19','ausente',NULL,'2026-08-24 02:46:55'),(158,20,'2026-08-20','ausente',NULL,'2026-08-24 02:46:55'),(159,20,'2026-08-21','ausente',NULL,'2026-08-24 02:46:55'),(160,20,'2026-08-22','ausente',NULL,'2026-08-24 02:46:55'),(161,21,'2026-08-18','presente',NULL,'2026-08-24 02:46:55'),(162,21,'2026-08-19','ausente',NULL,'2026-08-24 02:46:55'),(163,21,'2026-08-20','ausente',NULL,'2026-08-24 02:46:55'),(164,21,'2026-08-21','ausente',NULL,'2026-08-24 02:46:55'),(165,21,'2026-08-22','presente',NULL,'2026-08-24 02:46:55'),(166,22,'2026-08-18','ausente',NULL,'2026-08-24 02:46:55'),(167,22,'2026-08-19','presente',NULL,'2026-08-24 02:46:55'),(168,22,'2026-08-20','presente',NULL,'2026-08-24 02:46:55'),(169,22,'2026-08-21','presente',NULL,'2026-08-24 02:46:55'),(170,22,'2026-08-22','presente',NULL,'2026-08-24 02:46:55');
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion_porcentajes`
--

DROP TABLE IF EXISTS `configuracion_porcentajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_porcentajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `concepto` varchar(50) NOT NULL,
  `porcentaje` decimal(5,2) NOT NULL DEFAULT '0.00',
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `concepto` (`concepto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_porcentajes`
--

LOCK TABLES `configuracion_porcentajes` WRITE;
/*!40000 ALTER TABLE `configuracion_porcentajes` DISABLE KEYS */;
INSERT INTO `configuracion_porcentajes` VALUES (1,'promedio_tareas',70.00,'Porcentaje del promedio de tareas y lecciones','2026-08-20 21:02:16','2026-08-20 21:02:16'),(2,'proyecto',15.00,'Porcentaje de la nota del proyecto','2026-08-20 21:02:16','2026-08-20 21:02:16'),(3,'examen',15.00,'Porcentaje de la nota del examen','2026-08-20 21:02:16','2026-08-20 21:02:16');
/*!40000 ALTER TABLE `configuracion_porcentajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) NOT NULL,
  `nombres_apellidos` varchar(100) NOT NULL,
  `telefono_representante` varchar(20) DEFAULT NULL,
  `sexo` enum('M','F') NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `edad` tinyint DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tipo_sangre` varchar(5) DEFAULT NULL,
  `discapacidad` varchar(50) DEFAULT 'NO',
  `discapacidad_tipo` varchar(100) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `ciudad` varchar(50) DEFAULT NULL,
  `parroquia` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `representante` varchar(100) DEFAULT NULL,
  `cedula_representante` varchar(20) DEFAULT NULL,
  `email_representante` varchar(100) DEFAULT NULL,
  `lugar_trabajo_representante` varchar(100) DEFAULT NULL,
  `anio_lectivo` varchar(10) DEFAULT NULL,
  `curso` varchar(50) DEFAULT NULL,
  `paralelo` varchar(10) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  `school_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cedula_school` (`cedula`,`school_id`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (4,'1400501076','Estudiante Modificado','0999999999','M','2008-05-15',18,'test@test.com','O+','NO',NULL,'Ecuador','Azuay','Cuenca','El Sagrario','Calle 123','Padre Prueba','1111111111','padre@test.com','Empresa XYZ','2026-2027','Segundo','A','Informatica',1,1,'2026-08-20 22:14:49','2026-08-20 22:14:49'),(7,'1700000000','Adrian Zurita','0991000000','M','2006-01-01',20,'adrian.zurita@estudiante.edu','A+','NO',NULL,'Ecuador','Azuay','Cuenca','El Sagrario','Calle 1 y Av. Principal','Maria Paredes','1700001000','maria.paredes@email.com','Empresa 1','2026-2027','Primero','A','Contabilidad',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(8,'1700000001','Alejandra Paredes','0991000001','F','2007-02-02',19,'alejandra.paredes@estudiante.edu','A-','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 2 y Av. Principal','Juan Castillo','1700001001','juan.castillo@email.com','Empresa 2','2026-2027','Segundo','B','Informatica',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(9,'1700000002','Andres Castillo','0991000002','M','2008-03-03',18,'andres.castillo@estudiante.edu','B+','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 3 y Av. Principal','Ana Reyes','1700001002','ana.reyes@email.com','Empresa 3','2026-2027','Tercero','A','Mecanica',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(10,'1700000003','Annabella Reyes','0997871893','F','2009-04-04',17,'annabella.reyes@estudiante.edu','B-','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 4 y Av. Principal','Luis Torres','1700001003','luis.torres@email.com','Empresa 4','2026-2027','Primero','B','Ciencias',1,1,'2026-08-20 22:31:10','2026-08-24 01:26:43'),(11,'1700000004','Bryan Torres','0991000004','M','2010-05-05',16,'bryan.torres@estudiante.edu','AB+','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 5 y Av. Principal','Carmen Fernandez','1700001004','carmen.fernandez@email.com','Empresa 5','2026-2027','Segundo','A','Contabilidad',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(12,'1700000005','Camila Fernandez','0991000005','F','2006-06-06',20,'camila.fernandez@estudiante.edu','AB-','SI','Visual','Ecuador','Azuay','Cuenca','El Sagrario','Calle 6 y Av. Principal','Roberto Mendoza','1700001005','roberto.mendoza@email.com','Empresa 6','2026-2027','Tercero','B','Informatica',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(13,'1700000006','Carlos Mendoza','0991000006','M','2007-07-07',19,'carlos.mendoza@estudiante.edu','O+','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 7 y Av. Principal','Patricia Vargas','1700001006','patricia.vargas@email.com','Empresa 7','2026-2027','Primero','A','Mecanica',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(14,'1700000007','Daniela Vargas','0991000007','F','2008-08-08',18,'daniela.vargas@estudiante.edu','O-','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 8 y Av. Principal','Miguel Luna','1700001007','miguel.luna@email.com','Empresa 8','2026-2027','Segundo','B','Ciencias',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(15,'1700000008','David Luna','0991000008','M','2009-09-09',16,'david.luna@estudiante.edu','A+','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 9 y Av. Principal','Rosa Romero','1700001008','rosa.romero@email.com','Empresa 9','2026-2027','Tercero','A','Contabilidad',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(16,'1700000009','Diana Romero','0991000009','F','2010-10-10',15,'diana.romero@estudiante.edu','A-','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 10 y Av. Principal','Fernando Salazar','1700001009','fernando.salazar@email.com','Empresa 10','2026-2027','Primero','B','Informatica',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(17,'1700000010','Diego Salazar','0991000010','M','2006-11-11',19,'diego.salazar@estudiante.edu','B+','NO',NULL,'Ecuador','Azuay','Cuenca','El Sagrario','Calle 11 y Av. Principal','Lucia Guzman','1700001010','lucia.guzman@email.com','Empresa 11','2026-2027','Segundo','A','Mecanica',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(18,'1700000011','Elena Guzman','0991000011','F','2007-12-12',18,'elena.guzman@estudiante.edu','B-','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 12 y Av. Principal','Carlos Bravo','1700001011','carlos.bravo@email.com','Empresa 12','2026-2027','Tercero','B','Ciencias',1,1,'2026-08-20 22:31:10','2026-08-20 22:31:10'),(19,'1700000012','Emilio Bravo','0991000012','M','2008-01-13',18,'emilio.bravo@estudiante.edu','AB+','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 13 y Av. Principal','Teresa Rojas','1700001012','teresa.rojas@email.com','Empresa 13','2026-2027','Primero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(20,'1700000013','Estefania Rojas','0991000013','F','2009-02-14',17,'estefania.rojas@estudiante.edu','AB-','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 14 y Av. Principal','Jorge Ortiz','1700001013','jorge.ortiz@email.com','Empresa 14','2026-2027','Segundo','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(21,'1700000014','Felipe Ortiz','0991000014','M','2010-03-15',16,'felipe.ortiz@estudiante.edu','O+','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 15 y Av. Principal','Gladys Mendez','1700001014','gladys.mendez@email.com','Empresa 15','2026-2027','Tercero','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(22,'1700000015','Gabriela Mendez','0991000015','F','2006-04-16',20,'gabriela.mendez@estudiante.edu','O-','SI','Visual','Ecuador','Azuay','Cuenca','El Sagrario','Calle 16 y Av. Principal','Ricardo Silva','1700001015','ricardo.silva@email.com','Empresa 16','2026-2027','Primero','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(23,'1700000016','Hector Silva','0991000016','M','2007-05-17',19,'hector.silva@estudiante.edu','A+','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 17 y Av. Principal','Sonia Cruz','1700001016','sonia.cruz@email.com','Empresa 17','2026-2027','Segundo','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(24,'1700000017','Isabel Cruz','0991000017','F','2008-06-18',18,'isabel.cruz@estudiante.edu','A-','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 18 y Av. Principal','Alfredo Ponce','1700001017','alfredo.ponce@email.com','Empresa 18','2026-2027','Tercero','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(25,'1700000018','Javier Ponce','0991000018','M','2009-07-19',17,'javier.ponce@estudiante.edu','B+','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 19 y Av. Principal','Mirta Loor','1700001018','mirta.loor@email.com','Empresa 19','2026-2027','Primero','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(26,'1700000019','Jennifer Loor','0991000019','F','2010-08-20',16,'jennifer.loor@estudiante.edu','B-','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 20 y Av. Principal','Enrique Vera','1700001019','enrique.vera@email.com','Empresa 20','2026-2027','Segundo','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(27,'1700000020','Jesus Vera','0991000020','M','2006-09-21',19,'jesus.vera@estudiante.edu','AB+','NO',NULL,'Ecuador','Azuay','Cuenca','El Sagrario','Calle 21 y Av. Principal','Martha Mera','1700001020','martha.mera@email.com','Empresa 21','2026-2027','Tercero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(28,'1700000021','Karen Mera','0991000021','F','2007-10-22',18,'karen.mera@estudiante.edu','AB-','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 22 y Av. Principal','Humberto Gavilanes','1700001021','humberto.gavilanes@email.com','Empresa 22','2026-2027','Primero','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(29,'1700000022','Lautaro Gavilanes','0991000022','M','2008-11-23',17,'lautaro.gavilanes@estudiante.edu','O+','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 23 y Av. Principal','Gloria Barreto','1700001022','gloria.barreto@email.com','Empresa 23','2026-2027','Segundo','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(30,'1700000023','Luis Barreto','0991000023','F','2009-12-24',16,'luis.barreto@estudiante.edu','O-','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 24 y Av. Principal','Raul Acosta','1700001023','raul.acosta@email.com','Empresa 24','2026-2027','Tercero','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(31,'1700000024','Mariana Acosta','0991000024','M','2010-01-25',16,'mariana.acosta@estudiante.edu','A+','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 25 y Av. Principal','Nancy Espinoza','1700001024','nancy.espinoza@email.com','Empresa 25','2026-2027','Primero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(32,'1700000025','Marco Espinoza','0991000025','F','2006-02-26',20,'marco.espinoza@estudiante.edu','A-','SI','Visual','Ecuador','Azuay','Cuenca','El Sagrario','Calle 26 y Av. Principal','Pedro Campos','1700001025','pedro.campos@email.com','Empresa 26','2026-2027','Segundo','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(33,'1700000026','Maria Jose Pinsaquí','0991000026','M','2007-03-27',19,'maria.jose.pinsaquí@estudiante.edu','B+','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 27 y Av. Principal','Liliana Jaramillo','1700001026','liliana.jaramillo@email.com','Empresa 27','2026-2027','Tercero','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(34,'1700000027','Nelson Campos','0991000027','F','2008-04-28',18,'nelson.campos@estudiante.edu','B-','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 28 y Av. Principal','Manuel Tenesaca','1700001027','manuel.tenesaca@email.com','Empresa 28','2026-2027','Primero','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(35,'1700000028','Nicole Jaramillo','0991000028','M','2009-05-01',17,'nicole.jaramillo@estudiante.edu','AB+','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 29 y Av. Principal','Veronica Borja','1700001028','veronica.borja@email.com','Empresa 29','2026-2027','Segundo','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(36,'1700000029','Oscar Tenesaca','0991000029','F','2010-06-02',16,'oscar.tenesaca@estudiante.edu','AB-','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 30 y Av. Principal','Sergio Cisneros','1700001029','sergio.cisneros@email.com','Empresa 30','2026-2027','Tercero','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(37,'1700000030','Patricia Borja','0991000030','M','2006-07-03',20,'patricia.borja@estudiante.edu','O+','NO',NULL,'Ecuador','Azuay','Cuenca','El Sagrario','Calle 31 y Av. Principal','Adriana Ortiz','1700001030','adriana.ortiz@email.com','Empresa 31','2026-2027','Primero','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(38,'1700000031','Rafael Cisneros','0991000031','F','2007-08-04',19,'rafael.cisneros@estudiante.edu','O-','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 32 y Av. Principal','Gonzalo Pinto','1700001031','gonzalo.pinto@email.com','Empresa 32','2026-2027','Segundo','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(39,'1700000032','Renata Ortiz','0991000032','M','2008-09-05',17,'renata.ortiz@estudiante.edu','A+','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 33 y Av. Principal','Isabel Aguirre','1700001032','isabel.aguirre@email.com','Empresa 33','2026-2027','Tercero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(40,'1700000033','Ricardo Pinto','0991000033','F','2009-10-06',16,'ricardo.pinto@estudiante.edu','A-','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 34 y Av. Principal','Pablo Hidalgo','1700001033','pablo.hidalgo@email.com','Empresa 34','2026-2027','Primero','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(41,'1700000034','Rocío Aguirre','0991000034','M','2010-11-07',15,'rocío.aguirre@estudiante.edu','B+','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 35 y Av. Principal','Claudia Carabali','1700001034','claudia.carabali@email.com','Empresa 35','2026-2027','Segundo','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(42,'1700000035','Santiago Hidalgo','0991000035','F','2006-12-08',19,'santiago.hidalgo@estudiante.edu','B-','SI','Visual','Ecuador','Azuay','Cuenca','El Sagrario','Calle 36 y Av. Principal','Andres Puga','1700001035','andres.puga@email.com','Empresa 36','2026-2027','Tercero','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(43,'1700000036','Selena Carabalí','0991000036','M','2007-01-09',19,'selena.carabalí@estudiante.edu','AB+','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 37 y Av. Principal','Eugenia Pilco','1700001036','eugenia.pilco@email.com','Empresa 37','2026-2027','Primero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(44,'1700000037','Tatiana Reyes','0991000037','F','2008-02-10',18,'tatiana.reyes@estudiante.edu','AB-','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 38 y Av. Principal','Ramon Delgado','1700001037','ramon.delgado@email.com','Empresa 38','2026-2027','Segundo','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(45,'1700000038','Valentina Puga','0991000038','M','2009-03-11',17,'valentina.puga@estudiante.edu','O+','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 39 y Av. Principal','Teresa Quintero','1700001038','teresa.quintero@email.com','Empresa 39','2026-2027','Tercero','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(46,'1700000039','Victor炳ler','0991000039','F','2010-04-12',16,'victor炳ler@estudiante.edu','O-','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 40 y Av. Principal','Oscar Moreira','1700001039','oscar.moreira@email.com','Empresa 40','2026-2027','Primero','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(47,'1700000040','Walter Pilco','0991000040','M','2006-05-13',20,'walter.pilco@estudiante.edu','A+','NO',NULL,'Ecuador','Azuay','Cuenca','El Sagrario','Calle 41 y Av. Principal','Diana Burbano','1700001040','diana.burbano@email.com','Empresa 41','2026-2027','Segundo','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(48,'1700000041','Ximena Delgado','0991000041','F','2007-06-14',19,'ximena.delgado@estudiante.edu','A-','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 42 y Av. Principal','Jose Cornejo','1700001041','jose.cornejo@email.com','Empresa 42','2026-2027','Tercero','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(49,'1700000042','Yessenia Quintero','0991000042','M','2008-07-15',18,'yessenia.quintero@estudiante.edu','B+','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 43 y Av. Principal','Laura Villacres','1700001042','laura.villacres@email.com','Empresa 43','2026-2027','Primero','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(50,'1700000043','Zuleika Moreira','0991000043','F','2009-08-16',17,'zuleika.moreira@estudiante.edu','B-','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 44 y Av. Principal','Jaime Albarracin','1700001043','jaime.albarracin@email.com','Empresa 44','2026-2027','Segundo','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(51,'1700000044','Alexandra Burbano','0991000044','M','2010-09-17',15,'alexandra.burbano@estudiante.edu','AB+','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 45 y Av. Principal','Monica Samaniego','1700001044','monica.samaniego@email.com','Empresa 45','2026-2027','Tercero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(52,'1700000045','Brandon Cornejo','0991000045','F','2006-10-18',19,'brandon.cornejo@estudiante.edu','AB-','SI','Visual','Ecuador','Azuay','Cuenca','El Sagrario','Calle 46 y Av. Principal','Ruben Pozo','1700001045','ruben.pozo@email.com','Empresa 46','2026-2027','Primero','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(53,'1700000046','Cristina Villacres','0991000046','M','2007-11-19',18,'cristina.villacres@estudiante.edu','O+','NO',NULL,'Ecuador','Guayas','Guayaquil','Todos Santos','Calle 47 y Av. Principal','Sandra Burgos','1700001046','sandra.burgos@email.com','Empresa 47','2026-2027','Segundo','A','Mecanica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(54,'1700000047','Daniel Albarracin','0991000047','F','2008-12-20',17,'daniel.albarracin@estudiante.edu','O-','NO',NULL,'Ecuador','Pichincha','Quito','Ceibos','Calle 48 y Av. Principal','Arturo Cevallos','1700001047','arturo.cevallos@email.com','Empresa 48','2026-2027','Tercero','B','Ciencias',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(55,'1700000048','Erica Samaniego','0991000048','M','2009-01-21',17,'erica.samaniego@estudiante.edu','A+','NO',NULL,'Ecuador','Manabi','Portoviejo','Sucre','Calle 49 y Av. Principal','Milena Figueroa','1700001048','milena.figueroa@email.com','Empresa 49','2026-2027','Primero','A','Contabilidad',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11'),(56,'1700000049','Francisco Pozo','0991000049','F','2010-02-22',16,'francisco.pozo@estudiante.edu','A-','NO',NULL,'Ecuador','Loja','Loja','San Sebastian','Calle 50 y Av. Principal','Hugo Yepez','1700001049','hugo.yepez@email.com','Empresa 50','2026-2027','Segundo','B','Informatica',1,1,'2026-08-20 22:31:11','2026-08-20 22:31:11');
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluaciones_recuperacion`
--

DROP TABLE IF EXISTS `evaluaciones_recuperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluaciones_recuperacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estudiante_id` int NOT NULL,
  `materia_id` int NOT NULL,
  `docente_id` int NOT NULL,
  `fecha` date NOT NULL,
  `tipo` enum('recuperacion','supletorio') DEFAULT 'recuperacion',
  `valoracion` text,
  `nota` decimal(4,2) DEFAULT NULL,
  `observaciones` text,
  `school_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `estudiante_id` (`estudiante_id`),
  KEY `materia_id` (`materia_id`),
  KEY `docente_id` (`docente_id`),
  CONSTRAINT `evaluaciones_recuperacion_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `evaluaciones_recuperacion_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `evaluaciones_recuperacion_ibfk_3` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluaciones_recuperacion`
--

LOCK TABLES `evaluaciones_recuperacion` WRITE;
/*!40000 ALTER TABLE `evaluaciones_recuperacion` DISABLE KEYS */;
INSERT INTO `evaluaciones_recuperacion` VALUES (1,56,1,2,'2026-08-24','recuperacion','',NULL,'',1,'2026-08-24 12:33:01');
/*!40000 ALTER TABLE `evaluaciones_recuperacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_grupo` varchar(100) NOT NULL,
  `materia_id` int NOT NULL,
  `estudiante_id` int NOT NULL,
  `school_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_grupo_estudiante` (`materia_id`,`estudiante_id`),
  KEY `estudiante_id` (`estudiante_id`),
  KEY `school_id` (`school_id`),
  KEY `idx_grupos_materia_id` (`materia_id`),
  CONSTRAINT `grupos_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grupos_ibfk_2` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grupos_ibfk_3` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos`
--

LOCK TABLES `grupos` WRITE;
/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
INSERT INTO `grupos` VALUES (5,'Matematicas - Primero B',3,10,1,'2026-08-20 22:34:18'),(6,'Matematicas - Primero B',3,22,1,'2026-08-20 22:34:18'),(7,'Matematicas - Primero B',3,34,1,'2026-08-20 22:34:18'),(8,'Matematicas - Primero B',3,46,1,'2026-08-20 22:34:18'),(9,'Mecanica - Segundo A',6,53,1,'2026-08-20 22:37:08'),(10,'Mecanica - Segundo A',6,17,1,'2026-08-20 22:37:08'),(11,'Mecanica - Segundo A',6,29,1,'2026-08-20 22:37:08'),(12,'Mecanica - Segundo A',6,41,1,'2026-08-20 22:37:08'),(13,'Emprendimiento - Segundo B',5,8,1,'2026-08-20 22:40:05'),(14,'Emprendimiento - Segundo B',5,20,1,'2026-08-20 22:40:05'),(15,'Emprendimiento - Segundo B',5,56,1,'2026-08-20 22:40:05'),(16,'Emprendimiento - Segundo B',5,32,1,'2026-08-20 22:40:05'),(17,'Emprendimiento - Segundo B',5,44,1,'2026-08-20 22:40:05'),(18,'Matematicas - Segundo B',1,8,1,'2026-08-20 22:41:02'),(19,'Matematicas - Segundo B',1,20,1,'2026-08-20 22:41:02'),(20,'Matematicas - Segundo B',1,56,1,'2026-08-20 22:41:02'),(21,'Matematicas - Segundo B',1,32,1,'2026-08-20 22:41:02'),(22,'Matematicas - Segundo B',1,44,1,'2026-08-20 22:41:02');
/*!40000 ALTER TABLE `grupos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justificaciones`
--

DROP TABLE IF EXISTS `justificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asistencia_id` int NOT NULL,
  `estudiante_id` int NOT NULL,
  `motivo` text NOT NULL,
  `justificado_por` varchar(100) DEFAULT '',
  `fecha_justificacion` date DEFAULT (curdate()),
  `school_id` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_justificacion` (`asistencia_id`),
  KEY `estudiante_id` (`estudiante_id`),
  CONSTRAINT `justificaciones_ibfk_1` FOREIGN KEY (`asistencia_id`) REFERENCES `asistencias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `justificaciones_ibfk_2` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificaciones`
--

LOCK TABLES `justificaciones` WRITE;
/*!40000 ALTER TABLE `justificaciones` DISABLE KEYS */;
INSERT INTO `justificaciones` VALUES (1,137,32,'justi','inspector','2026-08-23',1,'2026-08-24 02:54:51'),(2,162,32,'justifica','inspector','2026-08-23',1,'2026-08-24 02:54:58'),(3,138,32,'jjjj','inspector','2026-08-23',1,'2026-08-24 03:11:30'),(4,163,32,'jjjj','inspector','2026-08-23',1,'2026-08-24 03:11:30'),(5,133,56,'enfermedad','inspector','2026-08-24',1,'2026-08-24 12:28:06'),(6,158,56,'enfermedad','inspector','2026-08-24',1,'2026-08-24 12:28:06');
/*!40000 ALTER TABLE `justificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_materia` varchar(100) NOT NULL,
  `curso` varchar(50) NOT NULL,
  `paralelo` varchar(50) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `docente_id` int DEFAULT NULL,
  `tutor_id` int DEFAULT NULL,
  `school_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `docente_id` (`docente_id`),
  KEY `school_id` (`school_id`),
  KEY `tutor_id` (`tutor_id`),
  CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `materias_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `materias_ibfk_3` FOREIGN KEY (`tutor_id`) REFERENCES `tutores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
INSERT INTO `materias` VALUES (1,'Matematicas','Segundo','B','Informatica',2,2,1,'2026-08-20 21:09:38','2026-08-24 00:46:18'),(2,'Lengua','Segundo','A','Ciencias',9,NULL,1,'2026-08-20 21:09:38','2026-08-20 22:00:10'),(3,'Matematicas','Primero','B','Ciencias',2,2,1,'2026-08-20 21:09:38','2026-08-24 00:46:26'),(4,'Historia','Tercero','A','Ciencias',8,1,1,'2026-08-20 21:34:30','2026-08-24 00:44:53'),(5,'Emprendimiento','Segundo','B','Informatica',10,NULL,1,'2026-08-20 21:34:57','2026-08-20 22:39:53'),(6,'Electricidad','Segundo','A','Mecanica',15,NULL,1,'2026-08-20 22:36:44','2026-08-20 22:37:42'),(8,'ingles','primero','A','Mecanica',NULL,NULL,1,'2026-08-24 00:45:12','2026-08-24 00:45:32');
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes_whatsapp`
--

DROP TABLE IF EXISTS `mensajes_whatsapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes_whatsapp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estudiante` varchar(200) NOT NULL,
  `representante` varchar(200) DEFAULT '',
  `telefono` varchar(30) DEFAULT '',
  `grupo_nombre` varchar(100) DEFAULT '',
  `materia_nombre` varchar(100) DEFAULT '',
  `profesor` varchar(200) DEFAULT '',
  `tipo` varchar(50) DEFAULT 'general',
  `mensaje` text,
  `enviado_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes_whatsapp`
--

LOCK TABLES `mensajes_whatsapp` WRITE;
/*!40000 ALTER TABLE `mensajes_whatsapp` DISABLE KEYS */;
INSERT INTO `mensajes_whatsapp` VALUES (1,'Annabella Reyes','Luis Torres','0997871893','Matematicas - Primero B','Matematicas','Mgs. Irvin Rubio','inasistencia','Estimado/a Luis Torres, le informamos que el estudiante Annabella Reyes presenta inasistencia: 5 ausencias de 15 clases (33.3%). Atentamente, Mgs. Irvin Rubio.','2026-08-24 01:53:43');
/*!40000 ALTER TABLE `mensajes_whatsapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas`
--

DROP TABLE IF EXISTS `notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_id` int NOT NULL,
  `trimestre` tinyint NOT NULL,
  `tipo` enum('tarea','proyecto','examen') NOT NULL,
  `nota` decimal(5,2) DEFAULT NULL,
  `comentario` text,
  `fecha_registro` date DEFAULT NULL,
  `indice` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_nota_grupo_tipo_idx` (`grupo_id`,`trimestre`,`tipo`,`indice`),
  KEY `idx_notas_trimestre` (`trimestre`),
  KEY `idx_notas_grupo_trimestre` (`grupo_id`,`trimestre`),
  CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1406 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
INSERT INTO `notas` VALUES (920,13,1,'tarea',9.47,NULL,'2026-08-15',0,'2026-08-20 22:49:06'),(921,13,1,'tarea',7.73,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(922,13,1,'tarea',9.40,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(923,13,1,'proyecto',7.85,NULL,'2026-09-15',0,'2026-08-20 22:49:06'),(924,13,1,'proyecto',8.96,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(925,13,1,'proyecto',7.70,NULL,'2026-09-15',2,'2026-08-20 22:49:06'),(926,13,1,'examen',6.75,NULL,'2026-10-15',0,'2026-08-20 22:49:06'),(927,13,1,'examen',6.62,NULL,'2026-10-15',1,'2026-08-20 22:49:06'),(928,13,1,'examen',7.48,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(929,13,2,'tarea',9.25,NULL,'2026-11-15',0,'2026-08-20 22:49:06'),(930,13,2,'tarea',7.52,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(931,13,2,'tarea',9.46,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(932,13,2,'proyecto',7.87,NULL,'2026-12-15',0,'2026-08-20 22:49:06'),(933,13,2,'proyecto',7.35,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(934,13,2,'proyecto',7.53,NULL,'2026-12-15',2,'2026-08-20 22:49:06'),(935,13,2,'examen',6.87,NULL,'2027-01-15',0,'2026-08-20 22:49:06'),(936,13,2,'examen',6.12,NULL,'2027-01-15',1,'2026-08-20 22:49:06'),(937,13,2,'examen',7.20,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(938,13,3,'tarea',9.56,NULL,'2027-02-15',0,'2026-08-20 22:49:06'),(939,13,3,'tarea',7.70,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(940,13,3,'tarea',9.61,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(941,13,3,'proyecto',7.71,NULL,'2027-03-15',0,'2026-08-20 22:49:06'),(942,13,3,'proyecto',7.30,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(943,13,3,'proyecto',8.51,NULL,'2027-03-15',2,'2026-08-20 22:49:06'),(944,13,3,'examen',6.89,NULL,'2027-04-15',0,'2026-08-20 22:49:06'),(945,13,3,'examen',6.78,NULL,'2027-04-15',1,'2026-08-20 22:49:06'),(946,13,3,'examen',6.53,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(947,18,1,'tarea',5.90,NULL,'2026-08-15',0,'2026-08-20 22:49:06'),(948,18,1,'tarea',4.64,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(949,18,1,'tarea',6.71,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(950,18,1,'proyecto',5.05,NULL,'2026-09-15',0,'2026-08-20 22:49:06'),(951,18,1,'proyecto',5.52,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(952,18,1,'proyecto',5.59,NULL,'2026-09-15',2,'2026-08-20 22:49:06'),(953,18,1,'examen',5.55,NULL,'2026-10-15',0,'2026-08-20 22:49:06'),(954,18,1,'examen',5.05,NULL,'2026-10-15',1,'2026-08-20 22:49:06'),(955,18,1,'examen',4.96,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(956,18,2,'tarea',5.78,NULL,'2026-11-15',0,'2026-08-20 22:49:06'),(957,18,2,'tarea',4.85,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(958,18,2,'tarea',6.38,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(959,18,2,'proyecto',4.89,NULL,'2026-12-15',0,'2026-08-20 22:49:06'),(960,18,2,'proyecto',5.06,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(961,18,2,'proyecto',4.09,NULL,'2026-12-15',2,'2026-08-20 22:49:06'),(962,18,2,'examen',5.72,NULL,'2027-01-15',0,'2026-08-20 22:49:06'),(963,18,2,'examen',6.30,NULL,'2027-01-15',1,'2026-08-20 22:49:06'),(964,18,2,'examen',6.58,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(965,18,3,'tarea',6.04,NULL,'2027-02-15',0,'2026-08-20 22:49:06'),(966,18,3,'tarea',4.46,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(967,18,3,'tarea',6.32,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(968,18,3,'proyecto',4.98,NULL,'2027-03-15',0,'2026-08-20 22:49:06'),(969,18,3,'proyecto',5.64,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(970,18,3,'proyecto',5.44,NULL,'2027-03-15',2,'2026-08-20 22:49:06'),(971,18,3,'examen',5.63,NULL,'2027-04-15',0,'2026-08-20 22:49:06'),(972,18,3,'examen',5.49,NULL,'2027-04-15',1,'2026-08-20 22:49:06'),(973,18,3,'examen',5.33,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(974,5,1,'tarea',1.51,NULL,'2026-08-15',0,'2026-08-20 22:49:06'),(975,5,1,'tarea',1.67,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(976,5,1,'tarea',3.70,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(977,5,1,'proyecto',2.17,NULL,'2026-09-15',0,'2026-08-20 22:49:06'),(978,5,1,'proyecto',2.92,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(979,5,1,'proyecto',2.40,NULL,'2026-09-15',2,'2026-08-20 22:49:06'),(980,5,1,'examen',2.21,NULL,'2026-10-15',0,'2026-08-20 22:49:06'),(981,5,1,'examen',1.64,NULL,'2026-10-15',1,'2026-08-20 22:49:06'),(982,5,1,'examen',2.34,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(983,5,2,'tarea',1.01,NULL,'2026-11-15',0,'2026-08-20 22:49:06'),(984,5,2,'tarea',1.51,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(985,5,2,'tarea',3.72,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(986,5,2,'proyecto',2.13,NULL,'2026-12-15',0,'2026-08-20 22:49:06'),(987,5,2,'proyecto',3.25,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(988,5,2,'proyecto',2.57,NULL,'2026-12-15',2,'2026-08-20 22:49:06'),(989,5,2,'examen',2.11,NULL,'2027-01-15',0,'2026-08-20 22:49:06'),(990,5,2,'examen',3.11,NULL,'2027-01-15',1,'2026-08-20 22:49:06'),(991,5,2,'examen',2.89,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(992,5,3,'tarea',1.43,NULL,'2027-02-15',0,'2026-08-20 22:49:06'),(993,5,3,'tarea',1.67,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(994,5,3,'tarea',3.90,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(995,5,3,'proyecto',2.22,NULL,'2027-03-15',0,'2026-08-20 22:49:06'),(996,5,3,'proyecto',1.86,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(997,5,3,'proyecto',2.63,NULL,'2027-03-15',2,'2026-08-20 22:49:06'),(998,5,3,'examen',2.25,NULL,'2027-04-15',0,'2026-08-20 22:49:06'),(999,5,3,'examen',2.30,NULL,'2027-04-15',1,'2026-08-20 22:49:06'),(1000,5,3,'examen',1.50,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(1001,10,1,'tarea',8.38,NULL,'2026-08-15',0,'2026-08-20 22:49:06'),(1002,10,1,'tarea',8.23,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(1003,10,1,'tarea',9.44,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(1004,10,1,'proyecto',8.54,NULL,'2026-09-15',0,'2026-08-20 22:49:06'),(1005,10,1,'proyecto',8.88,NULL,'2026-09-15',1,'2026-08-20 22:49:06'),(1006,10,1,'proyecto',8.10,NULL,'2026-09-15',2,'2026-08-20 22:49:06'),(1007,10,1,'examen',7.27,NULL,'2026-10-15',0,'2026-08-20 22:49:06'),(1008,10,1,'examen',7.27,NULL,'2026-10-15',1,'2026-08-20 22:49:06'),(1009,10,1,'examen',7.46,NULL,'2026-10-15',2,'2026-08-20 22:49:06'),(1010,10,2,'tarea',8.03,NULL,'2026-11-15',0,'2026-08-20 22:49:06'),(1011,10,2,'tarea',8.02,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(1012,10,2,'tarea',9.26,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(1013,10,2,'proyecto',8.62,NULL,'2026-12-15',0,'2026-08-20 22:49:06'),(1014,10,2,'proyecto',9.47,NULL,'2026-12-15',1,'2026-08-20 22:49:06'),(1015,10,2,'proyecto',9.18,NULL,'2026-12-15',2,'2026-08-20 22:49:06'),(1016,10,2,'examen',7.30,NULL,'2027-01-15',0,'2026-08-20 22:49:06'),(1017,10,2,'examen',7.93,NULL,'2027-01-15',1,'2026-08-20 22:49:06'),(1018,10,2,'examen',6.65,NULL,'2027-01-15',2,'2026-08-20 22:49:06'),(1019,10,3,'tarea',8.43,NULL,'2027-02-15',0,'2026-08-20 22:49:06'),(1020,10,3,'tarea',8.18,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(1021,10,3,'tarea',9.57,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(1022,10,3,'proyecto',8.76,NULL,'2027-03-15',0,'2026-08-20 22:49:06'),(1023,10,3,'proyecto',7.77,NULL,'2027-03-15',1,'2026-08-20 22:49:06'),(1024,10,3,'proyecto',8.97,NULL,'2027-03-15',2,'2026-08-20 22:49:06'),(1025,10,3,'examen',7.12,NULL,'2027-04-15',0,'2026-08-20 22:49:06'),(1026,10,3,'examen',7.61,NULL,'2027-04-15',1,'2026-08-20 22:49:06'),(1027,10,3,'examen',6.35,NULL,'2027-04-15',2,'2026-08-20 22:49:06'),(1028,14,1,'tarea',6.12,NULL,'2026-08-15',0,'2026-08-20 22:49:07'),(1029,14,1,'tarea',5.25,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1030,14,1,'tarea',5.20,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1031,14,1,'proyecto',5.12,NULL,'2026-09-15',0,'2026-08-20 22:49:07'),(1032,14,1,'proyecto',4.73,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1033,14,1,'proyecto',4.66,NULL,'2026-09-15',2,'2026-08-20 22:49:07'),(1034,14,1,'examen',4.66,NULL,'2026-10-15',0,'2026-08-20 22:49:07'),(1035,14,1,'examen',5.03,NULL,'2026-10-15',1,'2026-08-20 22:49:07'),(1036,14,1,'examen',4.69,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1037,14,2,'tarea',6.29,NULL,'2026-11-15',0,'2026-08-20 22:49:07'),(1038,14,2,'tarea',5.43,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1039,14,2,'tarea',5.39,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1040,14,2,'proyecto',5.30,NULL,'2026-12-15',0,'2026-08-20 22:49:07'),(1041,14,2,'proyecto',4.76,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1042,14,2,'proyecto',5.58,NULL,'2026-12-15',2,'2026-08-20 22:49:07'),(1043,14,2,'examen',4.45,NULL,'2027-01-15',0,'2026-08-20 22:49:07'),(1044,14,2,'examen',3.50,NULL,'2027-01-15',1,'2026-08-20 22:49:07'),(1045,14,2,'examen',5.34,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1046,14,3,'tarea',6.00,NULL,'2027-02-15',0,'2026-08-20 22:49:07'),(1047,14,3,'tarea',5.13,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1048,14,3,'tarea',5.39,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1049,14,3,'proyecto',5.34,NULL,'2027-03-15',0,'2026-08-20 22:49:07'),(1050,14,3,'proyecto',4.75,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1051,14,3,'proyecto',4.78,NULL,'2027-03-15',2,'2026-08-20 22:49:07'),(1052,14,3,'examen',4.17,NULL,'2027-04-15',0,'2026-08-20 22:49:07'),(1053,14,3,'examen',3.88,NULL,'2027-04-15',1,'2026-08-20 22:49:07'),(1054,14,3,'examen',4.71,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1055,19,1,'tarea',1.41,NULL,'2026-08-15',0,'2026-08-20 22:49:07'),(1056,19,1,'tarea',2.87,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1057,19,1,'tarea',2.30,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1058,19,1,'proyecto',1.64,NULL,'2026-09-15',0,'2026-08-20 22:49:07'),(1059,19,1,'proyecto',1.37,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1060,19,1,'proyecto',2.07,NULL,'2026-09-15',2,'2026-08-20 22:49:07'),(1061,19,1,'examen',1.84,NULL,'2026-10-15',0,'2026-08-20 22:49:07'),(1062,19,1,'examen',0.92,NULL,'2026-10-15',1,'2026-08-20 22:49:07'),(1063,19,1,'examen',2.60,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1064,19,2,'tarea',1.35,NULL,'2026-11-15',0,'2026-08-20 22:49:07'),(1065,19,2,'tarea',2.76,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1066,19,2,'tarea',2.04,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1067,19,2,'proyecto',1.95,NULL,'2026-12-15',0,'2026-08-20 22:49:07'),(1068,19,2,'proyecto',2.01,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1069,19,2,'proyecto',1.03,NULL,'2026-12-15',2,'2026-08-20 22:49:07'),(1070,19,2,'examen',1.43,NULL,'2027-01-15',0,'2026-08-20 22:49:07'),(1071,19,2,'examen',2.42,NULL,'2027-01-15',1,'2026-08-20 22:49:07'),(1072,19,2,'examen',2.44,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1073,19,3,'tarea',0.90,NULL,'2027-02-15',0,'2026-08-20 22:49:07'),(1074,19,3,'tarea',2.89,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1075,19,3,'tarea',1.88,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1076,19,3,'proyecto',1.72,NULL,'2027-03-15',0,'2026-08-20 22:49:07'),(1077,19,3,'proyecto',2.61,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1078,19,3,'proyecto',1.35,NULL,'2027-03-15',2,'2026-08-20 22:49:07'),(1079,19,3,'examen',1.84,NULL,'2027-04-15',0,'2026-08-20 22:49:07'),(1080,19,3,'examen',2.00,NULL,'2027-04-15',1,'2026-08-20 22:49:07'),(1081,19,3,'examen',1.56,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1082,6,1,'tarea',8.27,NULL,'2026-08-15',0,'2026-08-20 22:49:07'),(1083,6,1,'tarea',7.88,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1084,6,1,'tarea',8.74,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1085,6,1,'proyecto',8.51,NULL,'2026-09-15',0,'2026-08-20 22:49:07'),(1086,6,1,'proyecto',9.47,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1087,6,1,'proyecto',8.43,NULL,'2026-09-15',2,'2026-08-20 22:49:07'),(1088,6,1,'examen',7.16,NULL,'2026-10-15',0,'2026-08-20 22:49:07'),(1089,6,1,'examen',7.01,NULL,'2026-10-15',1,'2026-08-20 22:49:07'),(1090,6,1,'examen',6.64,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1091,6,2,'tarea',8.22,NULL,'2026-11-15',0,'2026-08-20 22:49:07'),(1092,6,2,'tarea',7.80,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1093,6,2,'tarea',8.87,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1094,6,2,'proyecto',8.67,NULL,'2026-12-15',0,'2026-08-20 22:49:07'),(1095,6,2,'proyecto',9.58,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1096,6,2,'proyecto',9.07,NULL,'2026-12-15',2,'2026-08-20 22:49:07'),(1097,6,2,'examen',7.30,NULL,'2027-01-15',0,'2026-08-20 22:49:07'),(1098,6,2,'examen',6.37,NULL,'2027-01-15',1,'2026-08-20 22:49:07'),(1099,6,2,'examen',8.16,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1100,6,3,'tarea',8.34,NULL,'2027-02-15',0,'2026-08-20 22:49:07'),(1101,6,3,'tarea',7.99,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1102,6,3,'tarea',8.81,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1103,6,3,'proyecto',8.61,NULL,'2027-03-15',0,'2026-08-20 22:49:07'),(1104,6,3,'proyecto',8.83,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1105,6,3,'proyecto',8.27,NULL,'2027-03-15',2,'2026-08-20 22:49:07'),(1106,6,3,'examen',7.39,NULL,'2027-04-15',0,'2026-08-20 22:49:07'),(1107,6,3,'examen',7.24,NULL,'2027-04-15',1,'2026-08-20 22:49:07'),(1108,6,3,'examen',8.09,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1109,11,1,'tarea',4.82,NULL,'2026-08-15',0,'2026-08-20 22:49:07'),(1110,11,1,'tarea',5.37,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1111,11,1,'tarea',5.91,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1112,11,1,'proyecto',5.92,NULL,'2026-09-15',0,'2026-08-20 22:49:07'),(1113,11,1,'proyecto',6.59,NULL,'2026-09-15',1,'2026-08-20 22:49:07'),(1114,11,1,'proyecto',6.33,NULL,'2026-09-15',2,'2026-08-20 22:49:07'),(1115,11,1,'examen',6.63,NULL,'2026-10-15',0,'2026-08-20 22:49:07'),(1116,11,1,'examen',6.80,NULL,'2026-10-15',1,'2026-08-20 22:49:07'),(1117,11,1,'examen',7.59,NULL,'2026-10-15',2,'2026-08-20 22:49:07'),(1118,11,2,'tarea',4.77,NULL,'2026-11-15',0,'2026-08-20 22:49:07'),(1119,11,2,'tarea',5.50,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1120,11,2,'tarea',5.49,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1121,11,2,'proyecto',5.84,NULL,'2026-12-15',0,'2026-08-20 22:49:07'),(1122,11,2,'proyecto',5.28,NULL,'2026-12-15',1,'2026-08-20 22:49:07'),(1123,11,2,'proyecto',6.82,NULL,'2026-12-15',2,'2026-08-20 22:49:07'),(1124,11,2,'examen',6.82,NULL,'2027-01-15',0,'2026-08-20 22:49:07'),(1125,11,2,'examen',5.73,NULL,'2027-01-15',1,'2026-08-20 22:49:07'),(1126,11,2,'examen',7.38,NULL,'2027-01-15',2,'2026-08-20 22:49:07'),(1127,11,3,'tarea',5.26,NULL,'2027-02-15',0,'2026-08-20 22:49:07'),(1128,11,3,'tarea',5.72,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1129,11,3,'tarea',5.39,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1130,11,3,'proyecto',5.81,NULL,'2027-03-15',0,'2026-08-20 22:49:07'),(1131,11,3,'proyecto',6.99,NULL,'2027-03-15',1,'2026-08-20 22:49:07'),(1132,11,3,'proyecto',5.66,NULL,'2027-03-15',2,'2026-08-20 22:49:07'),(1133,11,3,'examen',6.72,NULL,'2027-04-15',0,'2026-08-20 22:49:07'),(1134,11,3,'examen',6.83,NULL,'2027-04-15',1,'2026-08-20 22:49:07'),(1135,11,3,'examen',5.77,NULL,'2027-04-15',2,'2026-08-20 22:49:07'),(1136,16,1,'tarea',2.53,NULL,'2026-08-15',0,'2026-08-20 22:49:08'),(1137,16,1,'tarea',1.77,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1138,16,1,'tarea',2.61,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1139,16,1,'proyecto',2.73,NULL,'2026-09-15',0,'2026-08-20 22:49:08'),(1140,16,1,'proyecto',2.49,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1141,16,1,'proyecto',3.09,NULL,'2026-09-15',2,'2026-08-20 22:49:08'),(1142,16,1,'examen',2.05,NULL,'2026-10-15',0,'2026-08-20 22:49:08'),(1143,16,1,'examen',1.59,NULL,'2026-10-15',1,'2026-08-20 22:49:08'),(1144,16,1,'examen',1.80,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1145,16,2,'tarea',2.60,NULL,'2026-11-15',0,'2026-08-20 22:49:08'),(1146,16,2,'tarea',1.61,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1147,16,2,'tarea',2.62,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1148,16,2,'proyecto',2.73,NULL,'2026-12-15',0,'2026-08-20 22:49:08'),(1149,16,2,'proyecto',3.36,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1150,16,2,'proyecto',2.35,NULL,'2026-12-15',2,'2026-08-20 22:49:08'),(1151,16,2,'examen',1.82,NULL,'2027-01-15',0,'2026-08-20 22:49:08'),(1152,16,2,'examen',1.08,NULL,'2027-01-15',1,'2026-08-20 22:49:08'),(1153,16,2,'examen',2.70,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1154,16,3,'tarea',2.24,NULL,'2027-02-15',0,'2026-08-20 22:49:08'),(1155,16,3,'tarea',1.71,NULL,'2027-03-15',1,'2026-08-20 22:49:08'),(1156,16,3,'tarea',2.26,NULL,'2027-04-15',2,'2026-08-20 22:49:08'),(1157,16,3,'proyecto',2.20,NULL,'2027-03-15',0,'2026-08-20 22:49:08'),(1158,16,3,'proyecto',2.75,NULL,'2027-03-15',1,'2026-08-20 22:49:08'),(1159,16,3,'proyecto',2.36,NULL,'2027-03-15',2,'2026-08-20 22:49:08'),(1160,16,3,'examen',1.77,NULL,'2027-04-15',0,'2026-08-20 22:49:08'),(1161,16,3,'examen',1.54,NULL,'2027-04-15',1,'2026-08-20 22:49:08'),(1162,16,3,'examen',1.06,NULL,'2027-04-15',2,'2026-08-20 22:49:08'),(1163,21,1,'tarea',8.34,NULL,'2026-08-15',0,'2026-08-20 22:49:08'),(1164,21,1,'tarea',7.28,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1165,21,1,'tarea',8.24,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1166,21,1,'proyecto',9.27,NULL,'2026-09-15',0,'2026-08-20 22:49:08'),(1167,21,1,'proyecto',9.03,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1168,21,1,'proyecto',9.25,NULL,'2026-09-15',2,'2026-08-20 22:49:08'),(1169,21,1,'examen',8.36,NULL,'2026-10-15',0,'2026-08-20 22:49:08'),(1170,21,1,'examen',7.80,NULL,'2026-10-15',1,'2026-08-20 22:49:08'),(1171,21,1,'examen',7.60,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1172,21,2,'tarea',7.98,NULL,'2026-11-15',0,'2026-08-20 22:49:08'),(1173,21,2,'tarea',7.67,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1174,21,2,'tarea',8.20,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1175,21,2,'proyecto',8.70,NULL,'2026-12-15',0,'2026-08-20 22:49:08'),(1176,21,2,'proyecto',9.29,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1177,21,2,'proyecto',8.83,NULL,'2026-12-15',2,'2026-08-20 22:49:08'),(1178,21,2,'examen',8.49,NULL,'2027-01-15',0,'2026-08-20 22:49:08'),(1179,21,2,'examen',8.94,NULL,'2027-01-15',1,'2026-08-20 22:49:08'),(1180,21,2,'examen',8.69,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1181,21,3,'tarea',7.89,NULL,'2027-02-15',0,'2026-08-20 22:49:08'),(1182,21,3,'tarea',7.34,NULL,'2027-03-15',1,'2026-08-20 22:49:08'),(1183,21,3,'tarea',8.24,NULL,'2027-04-15',2,'2026-08-20 22:49:08'),(1184,21,3,'proyecto',9.17,NULL,'2027-03-15',0,'2026-08-20 22:49:08'),(1185,21,3,'proyecto',9.39,NULL,'2027-03-15',1,'2026-08-20 22:49:08'),(1186,21,3,'proyecto',9.05,NULL,'2027-03-15',2,'2026-08-20 22:49:08'),(1187,21,3,'examen',8.81,NULL,'2027-04-15',0,'2026-08-20 22:49:08'),(1188,21,3,'examen',8.06,NULL,'2027-04-15',1,'2026-08-20 22:49:08'),(1189,21,3,'examen',8.18,NULL,'2027-04-15',2,'2026-08-20 22:49:08'),(1190,7,1,'tarea',5.34,NULL,'2026-08-15',0,'2026-08-20 22:49:08'),(1191,7,1,'tarea',5.20,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1192,7,1,'tarea',5.36,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1193,7,1,'proyecto',4.47,NULL,'2026-09-15',0,'2026-08-20 22:49:08'),(1194,7,1,'proyecto',4.83,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1195,7,1,'proyecto',4.69,NULL,'2026-09-15',2,'2026-08-20 22:49:08'),(1196,7,1,'examen',4.20,NULL,'2026-10-15',0,'2026-08-20 22:49:08'),(1197,7,1,'examen',4.40,NULL,'2026-10-15',1,'2026-08-20 22:49:08'),(1198,7,1,'examen',4.43,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1199,7,2,'tarea',5.19,NULL,'2026-11-15',0,'2026-08-20 22:49:08'),(1200,7,2,'tarea',5.01,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1201,7,2,'tarea',5.49,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1202,7,2,'proyecto',4.63,NULL,'2026-12-15',0,'2026-08-20 22:49:08'),(1203,7,2,'proyecto',4.52,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1204,7,2,'proyecto',5.13,NULL,'2026-12-15',2,'2026-08-20 22:49:08'),(1205,7,2,'examen',4.56,NULL,'2027-01-15',0,'2026-08-20 22:49:08'),(1206,7,2,'examen',4.89,NULL,'2027-01-15',1,'2026-08-20 22:49:08'),(1207,7,2,'examen',4.38,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1208,7,3,'tarea',5.21,NULL,'2027-02-15',0,'2026-08-20 22:49:08'),(1209,7,3,'tarea',5.19,NULL,'2027-03-15',1,'2026-08-20 22:49:08'),(1210,7,3,'tarea',5.61,NULL,'2027-04-15',2,'2026-08-20 22:49:08'),(1211,7,3,'proyecto',4.63,NULL,'2027-03-15',0,'2026-08-20 22:49:08'),(1212,7,3,'proyecto',4.47,NULL,'2027-03-15',1,'2026-08-20 22:49:08'),(1213,7,3,'proyecto',5.33,NULL,'2027-03-15',2,'2026-08-20 22:49:08'),(1214,7,3,'examen',4.56,NULL,'2027-04-15',0,'2026-08-20 22:49:08'),(1215,7,3,'examen',4.62,NULL,'2027-04-15',1,'2026-08-20 22:49:08'),(1216,7,3,'examen',3.51,NULL,'2027-04-15',2,'2026-08-20 22:49:08'),(1217,12,1,'tarea',2.13,NULL,'2026-08-15',0,'2026-08-20 22:49:08'),(1218,12,1,'tarea',2.65,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1219,12,1,'tarea',2.22,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1220,12,1,'proyecto',3.48,NULL,'2026-09-15',0,'2026-08-20 22:49:08'),(1221,12,1,'proyecto',3.14,NULL,'2026-09-15',1,'2026-08-20 22:49:08'),(1222,12,1,'proyecto',4.01,NULL,'2026-09-15',2,'2026-08-20 22:49:08'),(1223,12,1,'examen',1.93,NULL,'2026-10-15',0,'2026-08-20 22:49:08'),(1224,12,1,'examen',2.53,NULL,'2026-10-15',1,'2026-08-20 22:49:08'),(1225,12,1,'examen',2.09,NULL,'2026-10-15',2,'2026-08-20 22:49:08'),(1226,12,2,'tarea',1.76,NULL,'2026-11-15',0,'2026-08-20 22:49:08'),(1227,12,2,'tarea',2.50,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1228,12,2,'tarea',2.38,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1229,12,2,'proyecto',3.08,NULL,'2026-12-15',0,'2026-08-20 22:49:08'),(1230,12,2,'proyecto',3.20,NULL,'2026-12-15',1,'2026-08-20 22:49:08'),(1231,12,2,'proyecto',3.81,NULL,'2026-12-15',2,'2026-08-20 22:49:08'),(1232,12,2,'examen',2.07,NULL,'2027-01-15',0,'2026-08-20 22:49:08'),(1233,12,2,'examen',1.72,NULL,'2027-01-15',1,'2026-08-20 22:49:08'),(1234,12,2,'examen',2.58,NULL,'2027-01-15',2,'2026-08-20 22:49:08'),(1235,12,3,'tarea',2.15,NULL,'2027-02-15',0,'2026-08-20 22:49:09'),(1236,12,3,'tarea',2.61,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1237,12,3,'tarea',2.47,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1238,12,3,'proyecto',3.01,NULL,'2027-03-15',0,'2026-08-20 22:49:09'),(1239,12,3,'proyecto',3.75,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1240,12,3,'proyecto',2.61,NULL,'2027-03-15',2,'2026-08-20 22:49:09'),(1241,12,3,'examen',1.72,NULL,'2027-04-15',0,'2026-08-20 22:49:09'),(1242,12,3,'examen',1.61,NULL,'2027-04-15',1,'2026-08-20 22:49:09'),(1243,12,3,'examen',2.48,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1244,17,1,'tarea',7.98,NULL,'2026-08-15',0,'2026-08-20 22:49:09'),(1245,17,1,'tarea',7.50,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1246,17,1,'tarea',9.98,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1247,17,1,'proyecto',7.94,NULL,'2026-09-15',0,'2026-08-20 22:49:09'),(1248,17,1,'proyecto',7.49,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1249,17,1,'proyecto',7.81,NULL,'2026-09-15',2,'2026-08-20 22:49:09'),(1250,17,1,'examen',6.90,NULL,'2026-10-15',0,'2026-08-20 22:49:09'),(1251,17,1,'examen',7.88,NULL,'2026-10-15',1,'2026-08-20 22:49:09'),(1252,17,1,'examen',7.01,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1253,17,2,'tarea',7.87,NULL,'2026-11-15',0,'2026-08-20 22:49:09'),(1254,17,2,'tarea',7.46,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1255,17,2,'tarea',9.79,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1256,17,2,'proyecto',7.81,NULL,'2026-12-15',0,'2026-08-20 22:49:09'),(1257,17,2,'proyecto',8.40,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1258,17,2,'proyecto',8.59,NULL,'2026-12-15',2,'2026-08-20 22:49:09'),(1259,17,2,'examen',7.40,NULL,'2027-01-15',0,'2026-08-20 22:49:09'),(1260,17,2,'examen',8.13,NULL,'2027-01-15',1,'2026-08-20 22:49:09'),(1261,17,2,'examen',7.45,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1262,17,3,'tarea',7.56,NULL,'2027-02-15',0,'2026-08-20 22:49:09'),(1263,17,3,'tarea',7.54,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1264,17,3,'tarea',9.74,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1265,17,3,'proyecto',8.21,NULL,'2027-03-15',0,'2026-08-20 22:49:09'),(1266,17,3,'proyecto',7.73,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1267,17,3,'proyecto',7.25,NULL,'2027-03-15',2,'2026-08-20 22:49:09'),(1268,17,3,'examen',6.98,NULL,'2027-04-15',0,'2026-08-20 22:49:09'),(1269,17,3,'examen',7.45,NULL,'2027-04-15',1,'2026-08-20 22:49:09'),(1270,17,3,'examen',7.72,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1271,22,1,'tarea',5.31,NULL,'2026-08-15',0,'2026-08-20 22:49:09'),(1272,22,1,'tarea',5.43,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1273,22,1,'tarea',5.36,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1274,22,1,'proyecto',4.81,NULL,'2026-09-15',0,'2026-08-20 22:49:09'),(1275,22,1,'proyecto',5.49,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1276,22,1,'proyecto',3.72,NULL,'2026-09-15',2,'2026-08-20 22:49:09'),(1277,22,1,'examen',5.77,NULL,'2026-10-15',0,'2026-08-20 22:49:09'),(1278,22,1,'examen',5.33,NULL,'2026-10-15',1,'2026-08-20 22:49:09'),(1279,22,1,'examen',5.38,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1280,22,2,'tarea',5.16,NULL,'2026-11-15',0,'2026-08-20 22:49:09'),(1281,22,2,'tarea',5.26,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1282,22,2,'tarea',4.97,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1283,22,2,'proyecto',4.30,NULL,'2026-12-15',0,'2026-08-20 22:49:09'),(1284,22,2,'proyecto',3.61,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1285,22,2,'proyecto',5.33,NULL,'2026-12-15',2,'2026-08-20 22:49:09'),(1286,22,2,'examen',5.26,NULL,'2027-01-15',0,'2026-08-20 22:49:09'),(1287,22,2,'examen',4.75,NULL,'2027-01-15',1,'2026-08-20 22:49:09'),(1288,22,2,'examen',5.22,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1289,22,3,'tarea',5.33,NULL,'2027-02-15',0,'2026-08-20 22:49:09'),(1290,22,3,'tarea',5.62,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1291,22,3,'tarea',5.05,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1292,22,3,'proyecto',4.27,NULL,'2027-03-15',0,'2026-08-20 22:49:09'),(1293,22,3,'proyecto',4.25,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1294,22,3,'proyecto',3.60,NULL,'2027-03-15',2,'2026-08-20 22:49:09'),(1295,22,3,'examen',5.36,NULL,'2027-04-15',0,'2026-08-20 22:49:09'),(1296,22,3,'examen',5.99,NULL,'2027-04-15',1,'2026-08-20 22:49:09'),(1297,22,3,'examen',6.07,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1298,8,1,'tarea',2.71,NULL,'2026-08-15',0,'2026-08-20 22:49:09'),(1299,8,1,'tarea',2.08,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1300,8,1,'tarea',3.68,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1301,8,1,'proyecto',1.04,NULL,'2026-09-15',0,'2026-08-20 22:49:09'),(1302,8,1,'proyecto',1.36,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1303,8,1,'proyecto',1.64,NULL,'2026-09-15',2,'2026-08-20 22:49:09'),(1304,8,1,'examen',2.44,NULL,'2026-10-15',0,'2026-08-20 22:49:09'),(1305,8,1,'examen',1.81,NULL,'2026-10-15',1,'2026-08-20 22:49:09'),(1306,8,1,'examen',2.77,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1307,8,2,'tarea',2.83,NULL,'2026-11-15',0,'2026-08-20 22:49:09'),(1308,8,2,'tarea',2.05,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1309,8,2,'tarea',3.83,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1310,8,2,'proyecto',1.52,NULL,'2026-12-15',0,'2026-08-20 22:49:09'),(1311,8,2,'proyecto',1.97,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1312,8,2,'proyecto',2.30,NULL,'2026-12-15',2,'2026-08-20 22:49:09'),(1313,8,2,'examen',2.44,NULL,'2027-01-15',0,'2026-08-20 22:49:09'),(1314,8,2,'examen',1.72,NULL,'2027-01-15',1,'2026-08-20 22:49:09'),(1315,8,2,'examen',1.39,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1316,8,3,'tarea',2.81,NULL,'2027-02-15',0,'2026-08-20 22:49:09'),(1317,8,3,'tarea',1.75,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1318,8,3,'tarea',3.66,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1319,8,3,'proyecto',1.19,NULL,'2027-03-15',0,'2026-08-20 22:49:09'),(1320,8,3,'proyecto',1.15,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1321,8,3,'proyecto',0.39,NULL,'2027-03-15',2,'2026-08-20 22:49:09'),(1322,8,3,'examen',2.36,NULL,'2027-04-15',0,'2026-08-20 22:49:09'),(1323,8,3,'examen',2.89,NULL,'2027-04-15',1,'2026-08-20 22:49:09'),(1324,8,3,'examen',3.00,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1325,9,1,'tarea',7.86,NULL,'2026-08-15',0,'2026-08-20 22:49:09'),(1326,9,1,'tarea',7.66,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1327,9,1,'tarea',9.50,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1328,9,1,'proyecto',8.71,NULL,'2026-09-15',0,'2026-08-20 22:49:09'),(1329,9,1,'proyecto',8.95,NULL,'2026-09-15',1,'2026-08-20 22:49:09'),(1330,9,1,'proyecto',9.04,NULL,'2026-09-15',2,'2026-08-20 22:49:09'),(1331,9,1,'examen',7.78,NULL,'2026-10-15',0,'2026-08-20 22:49:09'),(1332,9,1,'examen',7.51,NULL,'2026-10-15',1,'2026-08-20 22:49:09'),(1333,9,1,'examen',8.86,NULL,'2026-10-15',2,'2026-08-20 22:49:09'),(1334,9,2,'tarea',8.04,NULL,'2026-11-15',0,'2026-08-20 22:49:09'),(1335,9,2,'tarea',7.83,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1336,9,2,'tarea',9.58,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1337,9,2,'proyecto',8.29,NULL,'2026-12-15',0,'2026-08-20 22:49:09'),(1338,9,2,'proyecto',9.47,NULL,'2026-12-15',1,'2026-08-20 22:49:09'),(1339,9,2,'proyecto',7.78,NULL,'2026-12-15',2,'2026-08-20 22:49:09'),(1340,9,2,'examen',8.19,NULL,'2027-01-15',0,'2026-08-20 22:49:09'),(1341,9,2,'examen',8.26,NULL,'2027-01-15',1,'2026-08-20 22:49:09'),(1342,9,2,'examen',8.92,NULL,'2027-01-15',2,'2026-08-20 22:49:09'),(1343,9,3,'tarea',7.95,NULL,'2027-02-15',0,'2026-08-20 22:49:09'),(1344,9,3,'tarea',7.63,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1345,9,3,'tarea',9.47,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1346,9,3,'proyecto',8.25,NULL,'2027-03-15',0,'2026-08-20 22:49:09'),(1347,9,3,'proyecto',9.12,NULL,'2027-03-15',1,'2026-08-20 22:49:09'),(1348,9,3,'proyecto',8.58,NULL,'2027-03-15',2,'2026-08-20 22:49:09'),(1349,9,3,'examen',7.68,NULL,'2027-04-15',0,'2026-08-20 22:49:09'),(1350,9,3,'examen',7.98,NULL,'2027-04-15',1,'2026-08-20 22:49:09'),(1351,9,3,'examen',7.82,NULL,'2027-04-15',2,'2026-08-20 22:49:09'),(1352,15,1,'tarea',4.70,NULL,'2026-08-15',0,'2026-08-20 22:49:10'),(1353,15,1,'tarea',5.95,NULL,'2026-09-15',1,'2026-08-20 22:49:10'),(1354,15,1,'tarea',5.89,NULL,'2026-10-15',2,'2026-08-20 22:49:10'),(1355,15,1,'proyecto',6.23,NULL,'2026-09-15',0,'2026-08-20 22:49:10'),(1356,15,1,'proyecto',7.27,NULL,'2026-09-15',1,'2026-08-20 22:49:10'),(1357,15,1,'proyecto',5.66,NULL,'2026-09-15',2,'2026-08-20 22:49:10'),(1358,15,1,'examen',6.22,NULL,'2026-10-15',0,'2026-08-20 22:49:10'),(1359,15,1,'examen',7.20,NULL,'2026-10-15',1,'2026-08-20 22:49:10'),(1360,15,1,'examen',6.62,NULL,'2026-10-15',2,'2026-08-20 22:49:10'),(1361,15,2,'tarea',4.64,NULL,'2026-11-15',0,'2026-08-20 22:49:10'),(1362,15,2,'tarea',6.05,NULL,'2026-12-15',1,'2026-08-20 22:49:10'),(1363,15,2,'tarea',5.34,NULL,'2027-01-15',2,'2026-08-20 22:49:10'),(1364,15,2,'proyecto',6.51,NULL,'2026-12-15',0,'2026-08-20 22:49:10'),(1365,15,2,'proyecto',5.97,NULL,'2026-12-15',1,'2026-08-20 22:49:10'),(1366,15,2,'proyecto',6.07,NULL,'2026-12-15',2,'2026-08-20 22:49:10'),(1367,15,2,'examen',6.23,NULL,'2027-01-15',0,'2026-08-20 22:49:10'),(1368,15,2,'examen',6.36,NULL,'2027-01-15',1,'2026-08-20 22:49:10'),(1369,15,2,'examen',6.53,NULL,'2027-01-15',2,'2026-08-20 22:49:10'),(1370,15,3,'tarea',4.60,NULL,'2027-02-15',0,'2026-08-20 22:49:10'),(1371,15,3,'tarea',5.90,NULL,'2027-03-15',1,'2026-08-20 22:49:10'),(1372,15,3,'tarea',5.74,NULL,'2027-04-15',2,'2026-08-20 22:49:10'),(1373,15,3,'proyecto',6.76,NULL,'2027-03-15',0,'2026-08-20 22:49:10'),(1374,15,3,'proyecto',6.03,NULL,'2027-03-15',1,'2026-08-20 22:49:10'),(1375,15,3,'proyecto',6.82,NULL,'2027-03-15',2,'2026-08-20 22:49:10'),(1376,15,3,'examen',6.18,NULL,'2027-04-15',0,'2026-08-20 22:49:10'),(1377,15,3,'examen',6.51,NULL,'2027-04-15',1,'2026-08-20 22:49:10'),(1378,15,3,'examen',7.13,NULL,'2027-04-15',2,'2026-08-20 22:49:10'),(1379,20,1,'tarea',1.62,NULL,'2026-08-15',0,'2026-08-20 22:49:10'),(1380,20,1,'tarea',1.59,NULL,'2026-09-15',1,'2026-08-20 22:49:10'),(1381,20,1,'tarea',0.73,NULL,'2026-10-15',2,'2026-08-20 22:49:10'),(1382,20,1,'proyecto',1.76,NULL,'2026-09-15',0,'2026-08-20 22:49:10'),(1383,20,1,'proyecto',2.38,NULL,'2026-09-15',1,'2026-08-20 22:49:10'),(1384,20,1,'proyecto',2.41,NULL,'2026-09-15',2,'2026-08-20 22:49:10'),(1385,20,1,'examen',3.57,NULL,'2026-10-15',0,'2026-08-20 22:49:10'),(1386,20,1,'examen',3.24,NULL,'2026-10-15',1,'2026-08-20 22:49:10'),(1387,20,1,'examen',4.02,NULL,'2026-10-15',2,'2026-08-20 22:49:10'),(1388,20,2,'tarea',1.52,NULL,'2026-11-15',0,'2026-08-20 22:49:10'),(1389,20,2,'tarea',2.03,NULL,'2026-12-15',1,'2026-08-20 22:49:10'),(1390,20,2,'tarea',0.69,NULL,'2027-01-15',2,'2026-08-20 22:49:10'),(1391,20,2,'proyecto',1.44,NULL,'2026-12-15',0,'2026-08-20 22:49:10'),(1392,20,2,'proyecto',1.83,NULL,'2026-12-15',1,'2026-08-20 22:49:10'),(1393,20,2,'proyecto',1.07,NULL,'2026-12-15',2,'2026-08-20 22:49:10'),(1394,20,2,'examen',3.26,NULL,'2027-01-15',0,'2026-08-20 22:49:10'),(1395,20,2,'examen',3.39,NULL,'2027-01-15',1,'2026-08-20 22:49:10'),(1396,20,2,'examen',3.66,NULL,'2027-01-15',2,'2026-08-20 22:49:10'),(1397,20,3,'tarea',1.93,NULL,'2027-02-15',0,'2026-08-20 22:49:10'),(1398,20,3,'tarea',1.79,NULL,'2027-03-15',1,'2026-08-20 22:49:10'),(1399,20,3,'tarea',0.73,NULL,'2027-04-15',2,'2026-08-20 22:49:10'),(1400,20,3,'proyecto',1.70,NULL,'2027-03-15',0,'2026-08-20 22:49:10'),(1401,20,3,'proyecto',2.00,NULL,'2027-03-15',1,'2026-08-20 22:49:10'),(1402,20,3,'proyecto',1.26,NULL,'2027-03-15',2,'2026-08-20 22:49:10'),(1403,20,3,'examen',3.45,NULL,'2027-04-15',0,'2026-08-20 22:49:10'),(1404,20,3,'examen',3.41,NULL,'2027-04-15',1,'2026-08-20 22:49:10'),(1405,20,3,'examen',3.62,NULL,'2027-04-15',2,'2026-08-20 22:49:10');
/*!40000 ALTER TABLE `notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes_refuerzo`
--

DROP TABLE IF EXISTS `planes_refuerzo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes_refuerzo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estudiante_id` int NOT NULL,
  `materia_id` int NOT NULL,
  `docente_id` int NOT NULL,
  `trimestre` int DEFAULT '1',
  `estrategia` varchar(200) NOT NULL,
  `objetivos` text,
  `recursos` text,
  `actividades` text,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('en_progreso','completado','cancelado') DEFAULT 'en_progreso',
  `school_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `estudiante_id` (`estudiante_id`),
  KEY `materia_id` (`materia_id`),
  KEY `docente_id` (`docente_id`),
  CONSTRAINT `planes_refuerzo_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `planes_refuerzo_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `planes_refuerzo_ibfk_3` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes_refuerzo`
--

LOCK TABLES `planes_refuerzo` WRITE;
/*!40000 ALTER TABLE `planes_refuerzo` DISABLE KEYS */;
INSERT INTO `planes_refuerzo` VALUES (1,10,3,2,1,'leeer','tratatatat','recursos','njhdjhsd','2026-08-17','2026-08-21','en_progreso',1,'2026-08-24 02:16:00','2026-08-24 02:19:39'),(2,56,1,2,1,'dfsdf','dsfsdf','sdfsdfs','dfdsfs','2026-08-24','2026-08-28','en_progreso',1,'2026-08-24 02:20:24','2026-08-24 02:20:24'),(3,56,1,2,1,'kjks','rcuèramndsjksd ','','','2026-08-24','2026-08-28','en_progreso',1,'2026-08-24 12:31:56','2026-08-24 12:31:56');
/*!40000 ALTER TABLE `planes_refuerzo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promedios_trimestrales`
--

DROP TABLE IF EXISTS `promedios_trimestrales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promedios_trimestrales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_id` int NOT NULL,
  `trimestre` tinyint NOT NULL,
  `promedio_tareas` decimal(5,2) DEFAULT NULL,
  `nota_proyecto` decimal(5,2) DEFAULT NULL,
  `nota_examen` decimal(5,2) DEFAULT NULL,
  `nota_final` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promedio` (`grupo_id`,`trimestre`),
  CONSTRAINT `promedios_trimestrales_ibfk_1` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promedios_trimestrales`
--

LOCK TABLES `promedios_trimestrales` WRITE;
/*!40000 ALTER TABLE `promedios_trimestrales` DISABLE KEYS */;
/*!40000 ALTER TABLE `promedios_trimestrales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (1,'Escuela Default','Direccion Default','0000000000','2026-08-20 21:02:16');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutores`
--

DROP TABLE IF EXISTS `tutores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `estado` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `tutores_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutores`
--

LOCK TABLES `tutores` WRITE;
/*!40000 ALTER TABLE `tutores` DISABLE KEYS */;
INSERT INTO `tutores` VALUES (1,'1400501010','Mgs. Erika Marquez','0960026979',NULL,1,1,'2026-08-24 00:07:40'),(2,'0125478523','otro','0997871893',NULL,1,1,'2026-08-24 00:46:08');
/*!40000 ALTER TABLE `tutores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('docente','secretaria','rector','inspector') DEFAULT 'docente',
  `school_id` int DEFAULT NULL,
  `estado` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','Rector',NULL,'Irvin123','rector',1,1,'2026-08-20 21:02:16'),(2,'1400501076','Mgs. Irvin Rubio','0991234567','Irvin123','docente',1,1,'2026-08-20 21:02:16'),(8,'1400501010','Mgs. Erika Marquez','0960026979','Erika123','docente',1,1,'2026-08-20 21:47:20'),(9,'1400501020','Mgs. Orlando LLivicura','0996589641','Orlando123','docente',1,1,'2026-08-20 21:47:45'),(10,'1400501030','Mgs. Patricia Jimenes','0986369479','Patricia123','docente',1,1,'2026-08-20 21:48:06'),(11,'1400501070','Rector',NULL,'rector123','rector',1,1,'2026-08-20 21:54:15'),(12,'1400501080','Rosita ',NULL,'Rosita123','secretaria',1,1,'2026-08-20 21:55:09'),(13,'1400501090','Rosita2',NULL,'Rosita2123','secretaria',1,1,'2026-08-20 21:55:54'),(14,'1400501040','Ing. Cristiam Castillo',NULL,'Cristiam123','inspector',1,1,'2026-08-20 21:58:51'),(15,'1400501000','Mgs. Mauro Tigre','0969061125','Rector123','docente',1,1,'2026-08-20 22:36:14'),(17,'0000000001','inspector',NULL,'inspector123','inspector',1,1,'2026-08-24 02:35:56');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-06 15:31:33
