-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2023 at 03:28 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `libre-voyage`
--
CREATE DATABASE IF NOT EXISTS `libre-voyage` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `libre-voyage`;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `roleName`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(256) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `roleId`) VALUES
(1, 'Admin', 'Admin', 'admin@gmail.com', 'd014351bd457cd341f7da9f1ee2bdb288853bad8bedced227f840beeef91fd48853b64e9f85592f84c0b24dab68038c069acf999c798343a626e151b566b1fc9', 1),
(2, 'User', 'User', 'user@user.com', 'd014351bd457cd341f7da9f1ee2bdb288853bad8bedced227f840beeef91fd48853b64e9f85592f84c0b24dab68038c069acf999c798343a626e151b566b1fc9', 2);

-- --------------------------------------------------------

--
-- Table structure for table `vacationfollowers`
--

CREATE TABLE `vacationfollowers` (
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacationfollowers`
--

INSERT INTO `vacationfollowers` (`userId`, `vacationId`) VALUES
(2, 3),
(2, 7),
(2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `destination` varchar(40) NOT NULL,
  `description` varchar(250) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(6,2) NOT NULL DEFAULT 0.00,
  `photoUrl` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `destination`, `description`, `startDate`, `endDate`, `price`, `photoUrl`) VALUES
(1, 'Miami', 'A vacation in Miami promises a vibrant blend of relaxation and excitement.', '2023-09-27', '2023-10-11', 950.00, '78183ef4-7fd6-4a7c-8d7e-27b3a98c607d.jpg'),
(2, 'Greece', 'Greece, a land of ancient wonders and idyllic islands, offers travelers rich history, breathtaking landscapes, delicious cuisine, and warm hospitality.', '2023-08-11', '2023-08-19', 1234.00, 'b487bd0b-d87f-4a53-bc12-61058a3fe580.jpeg'),
(3, 'Florida', 'Florida, known for its sunny beaches, theme parks like Disney World, and diverse ecosystems, is a top tourist destination offering fun, adventure, and natural beauty.', '2023-09-29', '2023-10-29', 1250.00, '58f60e81-54f7-461f-a0e1-030dc7885b4f.jpg'),
(4, 'Dubai', 'Dubai, a modern marvel in the desert, boasts luxury shopping, futuristic architecture, desert safaris, and a vibrant blend of cultures, making it a global hotspot for leisure and business.', '2023-09-25', '2023-10-02', 4500.00, '8ff448d4-f833-4710-b906-731973371187.jpg'),
(5, 'Egypt', 'Egypt, land of pharaohs and pyramids, beckons with its ancient history, Nile River cruises, desert landscapes, and the awe-inspiring Sphinx and Great Pyramids of Giza.', '2023-09-23', '2023-09-28', 150.00, '1f4b2bdb-3a68-496c-ae37-461d7dd7d2a2.jpg'),
(6, 'London', 'London, a global metropolis, blends history and modernity. Iconic landmarks like Big Ben and the Tower Bridge adorn the Thames River, while diverse neighborhoods offer cultural richness.', '2023-09-29', '2023-09-30', 1234.00, '40b15e9c-aac5-4fb1-aa69-0ccd0519a7e6.jpg'),
(7, 'Maldives', 'The Maldives, an enchanting archipelago in the Indian Ocean, captivates with its turquoise waters, coral reefs, and overwater bungalows.', '2023-10-16', '2023-10-30', 2500.00, 'a2656b78-3516-4c1f-b9d3-c35f3fcc7794.jpg'),
(8, 'Africa', 'Africa, a vast and diverse continent, boasts rich cultural tapestry. From Sahara\'s arid landscapes to lush rainforests, nature thrives.', '2023-11-23', '2023-12-23', 6500.00, '7925640a-cd14-46af-9139-2ef70fbbe112.jpg'),
(9, 'Argentina', 'Argentina, the eighth-largest country globally, captivates with its diverse landscapes and vibrant culture. From the breathtaking Andes Mountains to the vast Pampas plains', '2023-11-23', '2023-12-23', 7600.00, '3addb571-868f-4353-b31a-95670d0508fe.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `vacationfollowers`
--
ALTER TABLE `vacationfollowers`
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`);

--
-- Constraints for table `vacationfollowers`
--
ALTER TABLE `vacationfollowers`
  ADD CONSTRAINT `vacationfollowers_ibfk_1` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vacationfollowers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
