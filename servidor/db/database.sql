-- MySQL dump 10.13  Distrib 5.7.39, for Win64 (x86_64)
--
-- Host: mysql-solucionesweb.alwaysdata.net    Database: solucionesweb_cineapp
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.7-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actores` (
  `id_actor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `imagen` varchar(150) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_actor`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actores`
--

LOCK TABLES `actores` WRITE;
/*!40000 ALTER TABLE `actores` DISABLE KEYS */;
/*!40000 ALTER TABLE `actores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boletos`
--

DROP TABLE IF EXISTS `boletos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boletos` (
  `id_boleto` int(11) NOT NULL AUTO_INCREMENT,
  `id_funcion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `security` varchar(200) NOT NULL,
  `folio` varchar(45) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `pagado` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_boleto`),
  KEY `fk_boletos_funciones_idx` (`id_funcion`),
  KEY `fk_boletos_usuarios_idx` (`id_usuario`),
  CONSTRAINT `fk_boletos_funciones` FOREIGN KEY (`id_funcion`) REFERENCES `funciones` (`id_funcion`),
  CONSTRAINT `fk_boletos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boletos`
--

LOCK TABLES `boletos` WRITE;
/*!40000 ALTER TABLE `boletos` DISABLE KEYS */;
/*!40000 ALTER TABLE `boletos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directores`
--

DROP TABLE IF EXISTS `directores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directores` (
  `id_director` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_director`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directores`
--

LOCK TABLES `directores` WRITE;
/*!40000 ALTER TABLE `directores` DISABLE KEYS */;
/*!40000 ALTER TABLE `directores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funciones`
--

DROP TABLE IF EXISTS `funciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `funciones` (
  `id_funcion` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `aforo` int(11) NOT NULL,
  `sala` int(2) NOT NULL,
  `horario` time NOT NULL,
  `desde` date NOT NULL,
  `hasta` date NOT NULL,
  `costo_boleto` float NOT NULL DEFAULT 45,
  `status` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id_funcion`),
  KEY `fk_funciones_peliculas_idx` (`id_pelicula`),
  CONSTRAINT `fk_funciones_peliculas` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generos` (
  `id_genero` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_genero`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idiomas`
--

DROP TABLE IF EXISTS `idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `idiomas` (
  `id_idioma` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_idioma`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `idiomas`
--

LOCK TABLES `idiomas` WRITE;
/*!40000 ALTER TABLE `idiomas` DISABLE KEYS */;
/*!40000 ALTER TABLE `idiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas`
--

DROP TABLE IF EXISTS `peliculas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peliculas` (
  `id_pelicula` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `sinopsis` varchar(500) NOT NULL,
  `fecha_estreno` date NOT NULL,
  `duracion` int(11) NOT NULL,
  `disponibilidad` tinyint(4) NOT NULL,
  `puntuacion` varchar(45) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `imagen` varchar(150) DEFAULT NULL,
  `torrent` varchar(150) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas`
--

LOCK TABLES `peliculas` WRITE;
/*!40000 ALTER TABLE `peliculas` DISABLE KEYS */;
/*!40000 ALTER TABLE `peliculas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_actores`
--

DROP TABLE IF EXISTS `peliculas_actores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peliculas_actores` (
  `id_peliculas_actores` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `id_actor` int(11) NOT NULL,
  PRIMARY KEY (`id_peliculas_actores`),
  KEY `fk_peliculas_actores_idx` (`id_pelicula`),
  KEY `fk_actores_peliculas_idx` (`id_actor`),
  CONSTRAINT `fk_actores_peliculas` FOREIGN KEY (`id_actor`) REFERENCES `actores` (`id_actor`),
  CONSTRAINT `fk_peliculas_actores` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_actores`
--

LOCK TABLES `peliculas_actores` WRITE;
/*!40000 ALTER TABLE `peliculas_actores` DISABLE KEYS */;
/*!40000 ALTER TABLE `peliculas_actores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_directores`
--

DROP TABLE IF EXISTS `peliculas_directores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peliculas_directores` (
  `id_peliculas_directores` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `id_director` int(11) NOT NULL,
  PRIMARY KEY (`id_peliculas_directores`),
  KEY `fk_peliculas_directores_idx` (`id_pelicula`),
  KEY `fk_directores_peliculas_idx` (`id_director`),
  CONSTRAINT `fk_directores_peliculas` FOREIGN KEY (`id_director`) REFERENCES `directores` (`id_director`),
  CONSTRAINT `fk_peliculas_directores` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_directores`
--

LOCK TABLES `peliculas_directores` WRITE;
/*!40000 ALTER TABLE `peliculas_directores` DISABLE KEYS */;
/*!40000 ALTER TABLE `peliculas_directores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_generos`
--

DROP TABLE IF EXISTS `peliculas_generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peliculas_generos` (
  `id_peliculas_generos` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `id_genero` int(11) NOT NULL,
  PRIMARY KEY (`id_peliculas_generos`),
  KEY `fk_peliculas_generos_idx` (`id_pelicula`),
  KEY `fk_generos_peliculas_idx` (`id_genero`),
  CONSTRAINT `fk_generos_peliculas` FOREIGN KEY (`id_genero`) REFERENCES `generos` (`id_genero`),
  CONSTRAINT `fk_peliculas_generos` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_generos`
--

LOCK TABLES `peliculas_generos` WRITE;
/*!40000 ALTER TABLE `peliculas_generos` DISABLE KEYS */;
/*!40000 ALTER TABLE `peliculas_generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peliculas_idiomas`
--

DROP TABLE IF EXISTS `peliculas_idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peliculas_idiomas` (
  `id_peliculas_idiomas` int(11) NOT NULL AUTO_INCREMENT,
  `id_pelicula` int(11) NOT NULL,
  `id_idioma` int(11) NOT NULL,
  PRIMARY KEY (`id_peliculas_idiomas`),
  KEY `fk_peliculas_idiomas_idx` (`id_pelicula`),
  KEY `fk_idiomas_peliculas_idx` (`id_idioma`),
  CONSTRAINT `fk_idiomas_peliculas` FOREIGN KEY (`id_idioma`) REFERENCES `idiomas` (`id_idioma`),
  CONSTRAINT `fk_peliculas_idiomas` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peliculas_idiomas`
--

LOCK TABLES `peliculas_idiomas` WRITE;
/*!40000 ALTER TABLE `peliculas_idiomas` DISABLE KEYS */;
/*!40000 ALTER TABLE `peliculas_idiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_usuarios`
--

DROP TABLE IF EXISTS `rol_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol_usuarios` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `id_rol` int(11) NOT NULL DEFAULT 2,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `notificaciones` tinyint(4) NOT NULL DEFAULT 0,
  `two_factor` tinyint(4) NOT NULL DEFAULT 0,
  `telefono` varchar(13) DEFAULT NULL,
  `token_email` varchar(200) DEFAULT NULL,
  `token_password` varchar(200) DEFAULT NULL,
  `secret_oauth` varchar(200) DEFAULT NULL,
  `ultimo_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `fk_usuarios_rol_idx` (`id_rol`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol_usuarios` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'Administrador','admin@admin.com','$2a$10$j2ENOIIralvSrc2PkNt0eeuUIO7PjKz34LGq.s9J6EqzBMA.YlPMC',1,0,0,NULL,NULL,NULL,NULL,NULL)
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

-- Dump completed on 2022-11-28  2:33:52
