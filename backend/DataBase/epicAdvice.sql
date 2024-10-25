CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Age INT,
    Gender TEXT,
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
    Address TEXT     
    --Vaccination TEXT(to be created)
);
