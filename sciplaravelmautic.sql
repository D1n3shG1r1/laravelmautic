-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 26, 2025 at 10:36 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sciplaravelmautic`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL,
  `date_added` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `modified_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked_out` datetime DEFAULT NULL,
  `checked_out_by` int DEFAULT NULL,
  `checked_out_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `publish_up` datetime DEFAULT NULL,
  `publish_down` datetime DEFAULT NULL,
  `canvas_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `allow_restart` tinyint(1) NOT NULL,
  `deleted` datetime DEFAULT NULL,
  `version` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='list of campaigns';

-- --------------------------------------------------------

--
-- Table structure for table `campaign_events`
--

DROP TABLE IF EXISTS `campaign_events`;
CREATE TABLE IF NOT EXISTS `campaign_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaignId` int NOT NULL,
  `parentId` int DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventOrder` int NOT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` datetime DEFAULT NULL,
  `trigger_date` datetime DEFAULT NULL,
  `trigger_interval` int DEFAULT NULL,
  `trigger_interval_unit` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trigger_hour` time DEFAULT NULL,
  `trigger_restricted_start_hour` time DEFAULT NULL,
  `trigger_restricted_stop_hour` time DEFAULT NULL,
  `trigger_restricted_dow` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trigger_mode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decision_path` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `temp_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel_id` int DEFAULT NULL,
  `failed_count` int NOT NULL,
  `draft` tinyint(1) NOT NULL COMMENT 'temporary saved',
  PRIMARY KEY (`id`),
  KEY `campaignId` (`campaignId`),
  KEY `parentId` (`parentId`),
  KEY `type` (`type`),
  KEY `eventType` (`eventType`),
  KEY `channel` (`channel`),
  KEY `channel_id` (`channel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_events`
--

INSERT INTO `campaign_events` (`id`, `campaignId`, `parentId`, `name`, `description`, `type`, `eventType`, `eventOrder`, `properties`, `deleted`, `trigger_date`, `trigger_interval`, `trigger_interval_unit`, `trigger_hour`, `trigger_restricted_start_hour`, `trigger_restricted_stop_hour`, `trigger_restricted_dow`, `trigger_mode`, `decision_path`, `temp_id`, `channel`, `channel_id`, `failed_count`, `draft`) VALUES
(16, 1, 0, 'sdfsd', 'sdfsd', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"4G\"],\"device_os\":[\"Brew\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736512358', NULL, NULL, 0, 1),
(17, 1, 16, 'rwwer', 'rwwer', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"4G\"],\"device_os\":[\"Chrome OS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736512377', NULL, NULL, 0, 1),
(18, 1, 0, 'hhfghg', 'hhfghg', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"4G\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736512419', NULL, NULL, 0, 1),
(19, 1, 17, 'gkghkj', 'gkghkj', 'page.devicehit', 'decision', 3, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736513293', NULL, NULL, 0, 1),
(20, 1, 17, 'sdfsdfgsg', 'sdfsdfgsg', 'page.devicehit', 'decision', 3, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2F\"],\"device_os\":[\"AmigaOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736513349', NULL, NULL, 0, 1),
(21, 1, 0, 'sas', 'sas', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750290', NULL, NULL, 0, 1),
(22, 1, 21, 'sad', 'sad', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750312', NULL, NULL, 0, 1),
(23, 1, 0, 'dsds', 'dsds', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2F\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750518', NULL, NULL, 0, 1),
(24, 1, 23, 'sad', 'sad', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750540', NULL, NULL, 0, 1),
(25, 1, 0, 'sdd', 'sdd', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"AmigaOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750578', NULL, NULL, 0, 1),
(26, 1, 0, 'saS', 'saS', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750708', NULL, NULL, 0, 1),
(27, 1, 26, 'DSDSD', 'DSDSD', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750730', NULL, NULL, 0, 1),
(28, 1, 0, 'DASDS', 'DASDS', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"2F\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750774', NULL, NULL, 0, 1),
(29, 1, 28, 'DASD', 'DASD', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"2F\"],\"device_os\":[\"AmigaOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750792', NULL, NULL, 0, 1),
(30, 1, 0, 'DSAD', 'DSAD', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750820', NULL, NULL, 0, 1),
(31, 1, 30, 'FS', 'FS', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"2F\"],\"device_os\":[\"AmigaOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750835', NULL, NULL, 0, 1),
(32, 1, 0, 'SDD', 'SDD', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750869', NULL, NULL, 0, 1),
(33, 1, 32, 'SADS', 'SADS', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"5E\"],\"device_os\":[\"AmigaOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750896', NULL, NULL, 0, 1),
(34, 1, 0, 'ASA', 'ASA', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736750922', NULL, NULL, 0, 1),
(35, 1, 34, 'AD', 'AD', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"2F\"],\"device_os\":[\"AmigaOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736750938', NULL, NULL, 0, 1),
(36, 1, 0, 'sad', 'sad', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"4G\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736751013', NULL, NULL, 0, 1),
(37, 1, 36, 'czc', 'czc', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"27\"],\"device_os\":[\"Chrome OS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736751043', NULL, NULL, 0, 1),
(38, 1, 0, 'ewe', 'ewe', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"J7\"],\"device_os\":[\"Brew\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736755183', NULL, NULL, 0, 1),
(39, 1, 38, 'we', 'we', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"4G\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'yes', '1736755204', NULL, NULL, 0, 1),
(40, 1, 38, 'qww', 'qww', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2Q\"],\"device_os\":[\"Brew\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736755229', NULL, NULL, 0, 1),
(41, 1, 0, 'ewqe', 'ewqe', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"4G\"],\"device_os\":[\"BlackBerry\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736755368', NULL, NULL, 0, 1),
(42, 1, 41, 'qweqw', 'qweqw', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"J7\"],\"device_os\":[\"BlackBerry\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736755392', NULL, NULL, 0, 1),
(43, 1, 0, 'qsqs', 'qsqs', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"4G\"],\"device_os\":[\"Brew\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736755427', NULL, NULL, 0, 1),
(44, 1, 43, 'AS', 'AS', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"4G\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736755446', NULL, NULL, 0, 1),
(45, 1, 0, 'ASDA', 'ASDA', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"27\"],\"device_os\":[\"Chrome OS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736755481', NULL, NULL, 0, 1),
(46, 1, 45, 'AD', 'AD', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2Q\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736755498', NULL, NULL, 0, 1),
(47, 1, 0, 'ASDA', 'ASDA', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"2F\"],\"device_os\":[\"Chrome OS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736755527', NULL, NULL, 0, 1),
(48, 1, 47, 'ASD', 'ASD', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"J7\"],\"device_os\":[\"BlackBerry\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736755544', NULL, NULL, 0, 1),
(49, 1, 0, 'Sa', 'Sa', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"J7\"],\"device_os\":[\"Chrome OS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736755610', NULL, NULL, 0, 1),
(50, 1, 49, 'SAs', 'SAs', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"3Q\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736755628', NULL, NULL, 0, 1),
(51, 1, 0, 'daf', 'daf', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2F\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736760027', NULL, NULL, 0, 1),
(52, 1, 51, 'asda', 'asda', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2Q\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736760047', NULL, NULL, 0, 1),
(53, 1, 0, 'qwq', 'qwq', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Chrome OS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736760099', NULL, NULL, 0, 1),
(54, 1, 53, 'qwq', 'qwq', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"J7\"],\"device_os\":[\"BlackBerry\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736760117', NULL, NULL, 0, 1),
(55, 1, 0, 'fdf', 'fdf', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2Q\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736760827', NULL, NULL, 0, 1),
(56, 1, 0, 'fdf', 'fdf', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"J7\"],\"device_os\":[\"Brew\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736765290', NULL, NULL, 0, 1),
(57, 1, 0, 'dd', 'dd', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"2Q\"],\"device_os\":[\"BeOS\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736942045', NULL, NULL, 0, 1),
(58, 1, 0, 'dds', 'dds', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"5E\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1736942170', NULL, NULL, 0, 1),
(59, 1, 58, 'ffdf', 'ffdf', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"desktop\"],\"device_brand\":[\"3Q\"],\"device_os\":[\"BlackBerry\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1736942191', NULL, NULL, 0, 1),
(60, 1, 0, 'demoName', 'demoName', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\",\"smartphone\"],\"device_brand\":[\"SA\"],\"device_os\":[\"Windows\",\"Windows Mobile\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739255957042', NULL, NULL, 0, 1),
(61, 1, 0, 'demoName', 'demoName', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"desktop\",\"smartphone\"],\"device_brand\":[\"SA\"],\"device_os\":[\"Windows\",\"Windows Mobile\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739255957042', NULL, NULL, 0, 1),
(62, 1, 0, 'test', 'test', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"SA\"],\"device_os\":[\"Windows\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739262374074', NULL, NULL, 0, 1),
(63, 1, 0, 'demo', 'demo', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"SA\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739265437968', NULL, NULL, 0, 1),
(64, 1, 0, 'Demo NAme', 'Demo NAme', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"SA\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739276726916', NULL, NULL, 0, 1),
(65, 1, 0, 'testname', 'testname', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"SA\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739277334539', NULL, NULL, 0, 1),
(66, 1, 65, 'testname2', 'testname2', 'page.devicehit', 'decision', 2, '{\"device_type\":[\"smartphone\"],\"device_brand\":[\"05\"],\"device_os\":[\"Symbian\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '1739277369138', NULL, NULL, 0, 1),
(67, 1, 0, 'test3', 'test3', 'page.devicehit', 'decision', 1, '{\"device_type\":[\"smart display\"],\"device_brand\":[\"SO\"],\"device_os\":[\"Android\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'leadsource', '1739277413932', NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `campaign_segments`
--

DROP TABLE IF EXISTS `campaign_segments`;
CREATE TABLE IF NOT EXISTS `campaign_segments` (
  `campaign_id` int NOT NULL,
  `segment_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`campaign_id`,`segment_id`),
  KEY `segment_id` (`segment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_segments`
--

INSERT INTO `campaign_segments` (`campaign_id`, `segment_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner_id` int UNSIGNED DEFAULT NULL,
  `stage_id` int UNSIGNED DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL,
  `date_added` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_company` int NOT NULL COMMENT 'logged In User Company Id, Its user''s company not a contact''s company',
  `date_modified` datetime DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `modified_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked_out` datetime DEFAULT NULL,
  `checked_out_by` int DEFAULT NULL,
  `checked_out_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int NOT NULL,
  `last_active` datetime DEFAULT NULL,
  `internal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:array)',
  `social_cache` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:array)',
  `date_identified` datetime DEFAULT NULL,
  `preferred_profile_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address1` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address2` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zipcode` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_locale` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attribution_date` datetime DEFAULT NULL,
  `attribution` double DEFAULT NULL,
  `website` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foursquare` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skype` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `generated_email_domain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (substr(`email`,(locate(_utf8mb4'@',`email`) + 1))) VIRTUAL COMMENT '(DC2Type:generated)',
  PRIMARY KEY (`id`),
  KEY `IDX_B5FDFA5E7E3C61F9` (`owner_id`),
  KEY `IDX_B5FDFA5E2298D193` (`stage_id`),
  KEY `sciplead_date_added` (`date_added`),
  KEY `scipdate_identified` (`date_identified`),
  KEY `fax_search` (`fax`),
  KEY `preferred_locale_search` (`preferred_locale`),
  KEY `attribution_date_search` (`attribution_date`),
  KEY `attribution_search` (`attribution`),
  KEY `website_search` (`website`),
  KEY `facebook_search` (`facebook`),
  KEY `foursquare_search` (`foursquare`),
  KEY `instagram_search` (`instagram`),
  KEY `linkedin_search` (`linkedin`),
  KEY `skype_search` (`skype`),
  KEY `twitter_search` (`twitter`),
  KEY `contact_attribution` (`attribution`,`attribution_date`),
  KEY `date_added_country_index` (`date_added`,`country`),
  KEY `scipgenerated_email_domain` (`generated_email_domain`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `owner_id`, `stage_id`, `is_published`, `date_added`, `created_by`, `created_by_user`, `created_by_company`, `date_modified`, `modified_by`, `modified_by_user`, `checked_out`, `checked_out_by`, `checked_out_by_user`, `points`, `last_active`, `internal`, `social_cache`, `date_identified`, `preferred_profile_image`, `title`, `firstname`, `lastname`, `company`, `position`, `email`, `phone`, `mobile`, `address1`, `address2`, `city`, `state`, `zipcode`, `timezone`, `country`, `fax`, `preferred_locale`, `attribution_date`, `attribution`, `website`, `facebook`, `foursquare`, `instagram`, `linkedin`, `skype`, `twitter`) VALUES
(6, NULL, NULL, 1, '2025-02-21 22:34:01', 10, 'smriti smriti', 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, 'Mr', 'Manoj', 'Nakra', NULL, NULL, 'manojnakra@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_published` tinyint(1) NOT NULL,
  `date_added` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `modified_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked_out` datetime DEFAULT NULL,
  `checked_out_by` int DEFAULT NULL,
  `checked_out_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_admin` tinyint(1) NOT NULL,
  `readable_permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `is_published`, `date_added`, `created_by`, `created_by_user`, `date_modified`, `modified_by`, `modified_by_user`, `checked_out`, `checked_out_by`, `checked_out_by_user`, `name`, `description`, `is_admin`, `readable_permissions`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N;'),
(2, 1, '2024-08-20 06:06:44', 1, 'dinesh kumar', NULL, NULL, NULL, NULL, NULL, 'dinesh kumar', 'SubAdmin', NULL, 0, 'a:3:{s:19:\"campaign:categories\";a:3:{i:0;s:4:\"view\";i:1;s:6:\"create\";i:2;s:7:\"publish\";}s:18:\"campaign:campaigns\";a:5:{i:0;s:7:\"viewown\";i:1;s:7:\"editown\";i:2;s:6:\"create\";i:3;s:9:\"deleteown\";i:4;s:10:\"publishown\";}s:10:\"lead:leads\";a:4:{i:0;s:7:\"viewown\";i:1;s:7:\"editown\";i:2;s:6:\"create\";i:3;s:9:\"deleteown\";}}'),
(3, 1, '2024-12-23 06:14:10', 1, 'dinesh kumar', NULL, NULL, NULL, NULL, NULL, 'dinesh kumar', 'subadmin3', '<p>subadmin3</p>', 0, 'a:2:{s:16:\"asset:categories\";a:1:{i:0;s:4:\"edit\";}s:12:\"asset:assets\";a:1:{i:0;s:7:\"viewown\";}}'),
(4, 1, '2025-02-13 14:30:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N'),
(5, 1, '2025-02-13 14:31:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N'),
(6, 1, '2025-02-17 08:04:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N'),
(7, 1, '2025-02-17 08:08:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N'),
(8, 1, '2025-02-17 08:23:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N'),
(9, 1, '2025-02-17 08:27:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Administrator', 'Full system access', 1, 'N');

-- --------------------------------------------------------

--
-- Table structure for table `segments`
--

DROP TABLE IF EXISTS `segments`;
CREATE TABLE IF NOT EXISTS `segments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` int UNSIGNED DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL,
  `date_added` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `modified_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked_out` datetime DEFAULT NULL,
  `checked_out_by` int DEFAULT NULL,
  `checked_out_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `alias` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `is_global` tinyint(1) NOT NULL,
  `is_preference_center` tinyint(1) NOT NULL,
  `last_built_date` datetime DEFAULT NULL,
  `last_built_time` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `alias` (`alias`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `segment_contacts`
--

DROP TABLE IF EXISTS `segment_contacts`;
CREATE TABLE IF NOT EXISTS `segment_contacts` (
  `segment_id` int NOT NULL,
  `contact_id` bigint NOT NULL,
  `date_added` datetime NOT NULL,
  `manually_removed` tinyint(1) NOT NULL,
  `manually_added` tinyint(1) NOT NULL,
  PRIMARY KEY (`segment_id`),
  KEY `lead_id` (`contact_id`),
  KEY `contact_id` (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` int UNSIGNED DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL,
  `date_added` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `modified_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked_out` datetime DEFAULT NULL,
  `checked_out_by` int DEFAULT NULL,
  `checked_out_by_user` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locale` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_active` datetime DEFAULT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:array)',
  `signature` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_B6EE1AE5F85E0677` (`username`),
  UNIQUE KEY `UNIQ_B6EE1AE5E7927C74` (`email`),
  KEY `IDX_B6EE1AE5D60322AC` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `company_id`, `is_published`, `date_added`, `created_by`, `created_by_user`, `date_modified`, `modified_by`, `modified_by_user`, `checked_out`, `checked_out_by`, `checked_out_by_user`, `username`, `password`, `first_name`, `last_name`, `email`, `position`, `timezone`, `locale`, `last_login`, `last_active`, `preferences`, `signature`) VALUES
(1, 1, 0, 1, NULL, NULL, NULL, '2024-07-20 06:42:34', NULL, ' ', NULL, NULL, 'dinesh kumar', 'admin', '$2y$13$6Hkm7USdSZhfcB/rjxhC0O7sbS5kwpBqKPbD65MP.oHQusvS0f5yW', 'dinesh', 'kumar', 'dineshleadtech@gmail.com', NULL, 'Asia/Kolkata', 'en_US', '2025-02-06 07:20:31', '2025-02-06 07:20:31', 'a:0:{}', 'Best regards, |FROM_NAME|'),
(2, 2, 0, 1, '2024-08-15 05:36:32', 1, 'dinesh kumar', '2024-08-20 06:07:46', 1, 'dinesh kumar', NULL, NULL, 'dinesh kumar', 'subadmin', '$2y$13$AIKBm2fvyFqQM.POEslGv.CMijo4wNwwdJEwjsmuGscSHGV3zhOL6', 'subuser', 'subuser', 'subadmin@example.com', NULL, NULL, NULL, '2024-08-20 06:08:17', '2024-08-20 06:08:17', 'a:0:{}', 'Best regards, |FROM_NAME|'),
(6, 5, 2, 1, '2025-02-13 14:31:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'manoj@example.com', 'd03daf71f649887a47e5a31524873879792b1c95', 'manoj', 'nakra', 'manoj@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 6, 3, 1, '2025-02-17 08:04:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'narayan@example.com', '692784cc9070cdcbb3c8ec6327c71ce97d50544a', 'narayan', 'patil', 'narayan@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 7, 4, 1, '2025-02-17 08:08:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'rahim@example.com', '91ae931c66910752ae180575854a7dbbf43ba047', 'rahim', 'akram', 'rahim@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 8, 5, 1, '2025-02-17 08:23:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mayuri@example.com', '91ae931c66910752ae180575854a7dbbf43ba047', 'mayuri', 'udan', 'mayuri@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 9, 6, 1, '2025-02-17 08:27:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'smriti@example.com', '91ae931c66910752ae180575854a7dbbf43ba047', 'smriti', 'smriti', 'smriti@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_company`
--

DROP TABLE IF EXISTS `users_company`;
CREATE TABLE IF NOT EXISTS `users_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `website` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_company`
--

INSERT INTO `users_company` (`id`, `name`, `description`, `website`) VALUES
(2, 'scip company 2', NULL, NULL),
(3, 'scip company 3', NULL, NULL),
(4, 'scip company 4', NULL, NULL),
(5, 'scip company 5', NULL, NULL),
(6, 'scip company 6', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_B6EE1AE5D60322AC` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
