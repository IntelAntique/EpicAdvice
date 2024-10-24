CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Age INT,
    Gender ENUM('Male', 'Female', 'Other'),
    AccountInfo TEXT, 
    AllergyInfo TEXT,                      
    AppointmentInfo TEXT,                  
    BodyStructure TEXT,                    
    Careplan TEXT,                         
    FamilyMemberHistory TEXT,
    InfectionCondition TEXT,               
    MedicationStatement TEXT,             
    Nutrition TEXT,                        
    ActivityLevel TEXT,                    
    Occupation TEXT,                      
    UserAddress TEXT      
    Careplan TEXT,
    --Vaccination TEXT(to be created)
);
