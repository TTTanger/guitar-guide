-- SQLINES DEMO ***  Distrib 8.0.19, for Win64 (x86_64)
--
-- SQLINES DEMO ***   Database: guitar-guide
-- SQLINES DEMO *** -------------------------------------
-- SQLINES DEMO *** 0.42

/* SQLINES DEMO *** CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/* SQLINES DEMO *** CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/* SQLINES DEMO *** COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/* SQLINES DEMO ***  utf8mb4 */;
/* SQLINES DEMO *** TIME_ZONE=@@TIME_ZONE */;
/* SQLINES DEMO *** ZONE='+00:00' */;
/* SQLINES DEMO *** UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/* SQLINES DEMO *** FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/* SQLINES DEMO *** SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/* SQLINES DEMO *** SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- SQLINES DEMO *** or table `translations`
--

DROP TABLE IF EXISTS translations;
/* SQLINES DEMO *** d_cs_client     = @@character_set_client */;
/* SQLINES DEMO *** cter_set_client = utf8mb4 */;
-- SQLINES FOR EVALUATION USE ONLY (14 DAYS)
CREATE TABLE translations (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY,
  key_name varchar(100) NOT NULL,
  lang varchar(100) NOT NULL,
  value text,
  PRIMARY KEY (id)
)  ;

ALTER SEQUENCE translations_seq RESTART WITH 19;
/* SQLINES DEMO *** cter_set_client = @saved_cs_client */;

--
-- SQLINES DEMO *** table `translations`
--

LOCK TABLES translations WRITE;
/* SQLINES DEMO *** LE `translations` DISABLE KEYS */;
INSERT INTO translations VALUES (1,'nav.basics','en','Basics'),(2,'nav.basics','zh','基础'),(3,'nav.basics','de','Grundlagen'),(4,'nav.chords','en','Chords'),(5,'nav.chords','zh','和弦'),(6,'nav.chords','de','Akkorde'),(7,'nav.quiz','en','Quiz'),(8,'nav.quiz','zh','测验'),(9,'nav.quiz','de','Quiz'),(10,'aside.fontInc','en','Font+'),(11,'aside.fontInc','zh','增大字体'),(12,'aside.fontInc','de','Schrift+'),(13,'aside.fontDec','en','Font-'),(14,'aside.fontDec','zh','减小字体'),(15,'aside.fontDec','de','Schrift-'),(16,'button.logout','en','Log out'),(17,'button.logout','zh','退出登录'),(18,'button.logout','de','Abmelden');
/* SQLINES DEMO *** LE `translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- SQLINES DEMO *** or table `accounts`
--

DROP TABLE IF EXISTS accounts;
/* SQLINES DEMO *** d_cs_client     = @@character_set_client */;
/* SQLINES DEMO *** cter_set_client = utf8mb4 */;
CREATE TABLE accounts (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_name varchar(20) NOT NULL,
  user_password varchar(255) NOT NULL,
  user_avatar varchar(255) DEFAULT NULL,
  created_at date DEFAULT NULL,
  best_score int DEFAULT NULL,
  PRIMARY KEY (id)
)  ;

ALTER SEQUENCE accounts_seq RESTART WITH 23;
/* SQLINES DEMO *** cter_set_client = @saved_cs_client */;

--
-- SQLINES DEMO *** table `accounts`
--

LOCK TABLES accounts WRITE;
/* SQLINES DEMO *** LE `accounts` DISABLE KEYS */;
INSERT INTO accounts VALUES (20,'admin','test123','../images/default_avatar.jpeg','2025-07-11',1);
/* SQLINES DEMO *** LE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/* SQLINES DEMO *** ZONE=@OLD_TIME_ZONE */;

/* SQLINES DEMO *** ODE=@OLD_SQL_MODE */;
/* SQLINES DEMO *** GN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/* SQLINES DEMO *** E_CHECKS=@OLD_UNIQUE_CHECKS */;
/* SQLINES DEMO *** CTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/* SQLINES DEMO *** CTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/* SQLINES DEMO *** TION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/* SQLINES DEMO *** OTES=@OLD_SQL_NOTES */;

-- SQLINES DEMO ***  2025-07-20  2:41:54
