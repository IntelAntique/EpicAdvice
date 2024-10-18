CREATE DATABASE EpicAdvice;

USE EpicAdvice;

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Age INT,
    Gender ENUM('Male', 'Female', 'Other'),
    Careplan TEXT,
    FamilyMemberHistory TEXT,
    MedicalHistory TEXT,
    AllergyInfo TEXT,
    Vaccination TEXT
);
