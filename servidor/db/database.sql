-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: cinedb
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actores`
--

DROP TABLE IF EXISTS `actores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actores` (
  `id_actor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `foto` text,
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_actor`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actores`
--

LOCK TABLES `actores` WRITE;
/*!40000 ALTER TABLE `actores` DISABLE KEYS */;
INSERT INTO `actores` VALUES (1,'nombre','apellido','2019-10-10','/image/actores/1/model cine-1.png',1);
/*!40000 ALTER TABLE `actores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boletos`
--

DROP TABLE IF EXISTS `boletos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boletos` (
  `id_boleto` int NOT NULL AUTO_INCREMENT,
  `id_funcion` int NOT NULL,
  `security` varchar(200) NOT NULL,
  `folio` varchar(45) NOT NULL,
  PRIMARY KEY (`id_boleto`),
  KEY `fk_boletos_funciones_idx` (`id_funcion`),
  CONSTRAINT `fk_boletos_funciones` FOREIGN KEY (`id_funcion`) REFERENCES `funciones` (`id_funcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boletos`
--

LOCK TABLES `boletos` WRITE;
/*!40000 ALTER TABLE `boletos` DISABLE KEYS */;
/*!40000 ALTER TABLE `boletos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boletos_usuarios`
--

DROP TABLE IF EXISTS `boletos_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boletos_usuarios` (
  `id_boletos_usuarios` int NOT NULL AUTO_INCREMENT,
  `id_boleto` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_boletos_usuarios`),
  KEY `fk_boletos_usuarios_idx` (`id_boleto`),
  KEY `fk_usuarios_boletos_idx` (`id_usuario`),
  CONSTRAINT `fk_boletos_usuarios` FOREIGN KEY (`id_boleto`) REFERENCES `boletos` (`id_boleto`),
  CONSTRAINT `fk_usuarios_boletos` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boletos_usuarios`
--

LOCK TABLES `boletos_usuarios` WRITE;
/*!40000 ALTER TABLE `boletos_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `boletos_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directores`
--

DROP TABLE IF EXISTS `directores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directores` (
  `id_director` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_director`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directores`
--

LOCK TABLES `directores` WRITE;
/*!40000 ALTER TABLE `directores` DISABLE KEYS */;
INSERT INTO `directores` VALUES (1,'director nombre','apellido director',1);
/*!40000 ALTER TABLE `directores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funciones`
--

DROP TABLE IF EXISTS `funciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funciones` (
  `id_funcion` int NOT NULL AUTO_INCREMENT,
  `id_pelicula` int NOT NULL,
  `id_boleto` int NOT NULL,
  `id_horario` date NOT NULL,
  `aforo` int NOT NULL,
  `status` tinyint DEFAULT NULL,
  PRIMARY KEY (`id_funcion`),
  KEY `fk_funciones_peliculas_idx` (`id_pelicula`),
  CONSTRAINT `fk_funciones_peliculas` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funciones`
--

LOCK TABLES `funciones` WRITE;
/*!40000 ALTER TABLE `funciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `funciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generos`
--

DROP TABLE IF EXISTS `generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generos` (
  `id_genero` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_genero`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
INSERT INTO `generos` VALUES (1,'genero aleatorio',1);
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios`
--

DROP TABLE IF EXISTS `horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios` (
  `id_horario` int NOT NULL AUTO_INCREMENT,
  `id_funcion` int NOT NULL,
  `horario` time NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`id_horario`),
  KEY `fk_horarios_funciones_idx` (`id_funcion`),
  CONSTRAINT `fk_horarios_funciones` FOREIGN KEY (`id_funcion`) REFERENCES `funciones` (`id_funcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios`
--

LOCK TABLES `horarios` WRITE;
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idiomas`
--

DROP TABLE IF EXISTS `idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `idiomas` (
  `id_idioma` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_idioma`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `idiomas`
--

LOCK TABLES `idiomas` WRITE;
/*!40000 ALTER TABLE `idiomas` DISABLE KEYS */;
INSERT INTO `idiomas` VALUES (1,'Español',1);
/*!40000 ALTER TABLE `idiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas`
--

DROP TABLE IF EXISTS `peliculas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas` (
  `id_pelicula` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `sinopsis` varchar(500) NOT NULL,
  `fecha_estreno` date NOT NULL,
  `duracion` int NOT NULL,
  `disponibilidad` tinyint NOT NULL,
  `puntuacion` varchar(45) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas`
--

LOCK TABLES `peliculas` WRITE;
/*!40000 ALTER TABLE `peliculas` DISABLE KEYS */;
INSERT INTO `peliculas` VALUES (1,'Titulo de una pelicula xd','El sinopsis, descripcion de la pelicula :0','2022-10-09',300,1,NULL,NULL,1);
/*!40000 ALTER TABLE `peliculas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_actores`
--

DROP TABLE IF EXISTS `peliculas_actores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas_actores` (
  `id_peliculas_actores` int NOT NULL AUTO_INCREMENT,
  `id_pelicula` int NOT NULL,
  `id_actor` int NOT NULL,
  PRIMARY KEY (`id_peliculas_actores`),
  KEY `fk_peliculas_actores_idx` (`id_pelicula`),
  KEY `fk_actores_peliculas_idx` (`id_actor`),
  CONSTRAINT `fk_actores_peliculas` FOREIGN KEY (`id_actor`) REFERENCES `actores` (`id_actor`),
  CONSTRAINT `fk_peliculas_actores` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_actores`
--

LOCK TABLES `peliculas_actores` WRITE;
/*!40000 ALTER TABLE `peliculas_actores` DISABLE KEYS */;
INSERT INTO `peliculas_actores` VALUES (2,1,1);
/*!40000 ALTER TABLE `peliculas_actores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_directores`
--

DROP TABLE IF EXISTS `peliculas_directores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas_directores` (
  `id_peliculas_directores` int NOT NULL AUTO_INCREMENT,
  `id_pelicula` int NOT NULL,
  `id_director` int NOT NULL,
  PRIMARY KEY (`id_peliculas_directores`),
  KEY `fk_peliculas_directores_idx` (`id_pelicula`),
  KEY `fk_directores_peliculas_idx` (`id_director`),
  CONSTRAINT `fk_directores_peliculas` FOREIGN KEY (`id_director`) REFERENCES `directores` (`id_director`),
  CONSTRAINT `fk_peliculas_directores` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_directores`
--

LOCK TABLES `peliculas_directores` WRITE;
/*!40000 ALTER TABLE `peliculas_directores` DISABLE KEYS */;
INSERT INTO `peliculas_directores` VALUES (2,1,1);
/*!40000 ALTER TABLE `peliculas_directores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_generos`
--

DROP TABLE IF EXISTS `peliculas_generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas_generos` (
  `id_peliculas_generos` int NOT NULL AUTO_INCREMENT,
  `id_pelicula` int NOT NULL,
  `id_genero` int NOT NULL,
  PRIMARY KEY (`id_peliculas_generos`),
  KEY `fk_peliculas_generos_idx` (`id_pelicula`),
  KEY `fk_generos_peliculas_idx` (`id_genero`),
  CONSTRAINT `fk_generos_peliculas` FOREIGN KEY (`id_genero`) REFERENCES `generos` (`id_genero`),
  CONSTRAINT `fk_peliculas_generos` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_generos`
--

LOCK TABLES `peliculas_generos` WRITE;
/*!40000 ALTER TABLE `peliculas_generos` DISABLE KEYS */;
INSERT INTO `peliculas_generos` VALUES (2,1,1);
/*!40000 ALTER TABLE `peliculas_generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_idiomas`
--

DROP TABLE IF EXISTS `peliculas_idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas_idiomas` (
  `id_peliculas_idiomas` int NOT NULL AUTO_INCREMENT,
  `id_pelicula` int NOT NULL,
  `id_idioma` int NOT NULL,
  PRIMARY KEY (`id_peliculas_idiomas`),
  KEY `fk_peliculas_idiomas_idx` (`id_pelicula`),
  KEY `fk_idiomas_peliculas_idx` (`id_idioma`),
  CONSTRAINT `fk_idiomas_peliculas` FOREIGN KEY (`id_idioma`) REFERENCES `idiomas` (`id_idioma`),
  CONSTRAINT `fk_peliculas_idiomas` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_idiomas`
--

LOCK TABLES `peliculas_idiomas` WRITE;
/*!40000 ALTER TABLE `peliculas_idiomas` DISABLE KEYS */;
INSERT INTO `peliculas_idiomas` VALUES (3,1,1);
/*!40000 ALTER TABLE `peliculas_idiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_imagenes`
--

DROP TABLE IF EXISTS `peliculas_imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peliculas_imagenes` (
  `id_imagen` int NOT NULL AUTO_INCREMENT,
  `id_pelicula` int NOT NULL,
  `url` varchar(150) NOT NULL,
  PRIMARY KEY (`id_imagen`),
  KEY `fk_pelicula_imagenes_idx` (`id_pelicula`),
  CONSTRAINT `fk_pelicula_imagenes` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_imagenes`
--

LOCK TABLES `peliculas_imagenes` WRITE;
/*!40000 ALTER TABLE `peliculas_imagenes` DISABLE KEYS */;
INSERT INTO `peliculas_imagenes` VALUES (1,1,'src\\public\\image\\peliculas\\1\\model cine-1.png'),(2,1,'/peliculas/1/model cine-1.png'),(3,1,'/peliculas/1/model cine-1.png'),(4,1,'/image/peliculas/1/model cine-1.png');
/*!40000 ALTER TABLE `peliculas_imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_usuarios`
--

DROP TABLE IF EXISTS `rol_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_usuarios` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_usuarios`
--

LOCK TABLES `rol_usuarios` WRITE;
/*!40000 ALTER TABLE `rol_usuarios` DISABLE KEYS */;
INSERT INTO `rol_usuarios` VALUES (1,'Administrador','Tiene acceso al panel de administracion'),(2,'Usuario','Tiene permiso al Dashboard');
/*!40000 ALTER TABLE `rol_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_rol` int NOT NULL DEFAULT '2',
  `nombre` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` text NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `token_email` varchar(200) DEFAULT NULL,
  `token_password` varchar(200) DEFAULT NULL,
  `secret_oauth` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `fk_usuarios_rol_idx` (`id_rol`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol_usuarios` (`id_rol`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (32,2,'Nombre','robertofriber@gmail.com','$2a$10$6ev21/XTKy2OmqVf4kwCruE67eDVMAR9fNLA92NFsOqNy6Ga9V3ku',1,NULL,NULL,'PQ4REMISGMTTWR3R'),(33,2,'Roberto Friber','180094@utags.edu.mx','$2a$10$b1NLlG2DD6hust/21HZe3ekFsApo0Vl7R2Z84.zvQFWFCs6ChuIxq',1,NULL,NULL,NULL);
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

-- Dump completed on 2022-10-02 23:10:00
