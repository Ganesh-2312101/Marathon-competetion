-- Create Database
CREATE DATABASE IF NOT EXISTS marathon_registration;

USE marathon_registration;

-- Create Participants Table
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    district VARCHAR(100) NOT NULL,
    medium VARCHAR(20) DEFAULT NULL,
    marathon_category VARCHAR(20) NOT NULL,
    marathon_date VARCHAR(50) NOT NULL,
    age_category VARCHAR(20) NOT NULL,
    under_35 VARCHAR(10) NOT NULL,
    tshirt_size VARCHAR(10) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
