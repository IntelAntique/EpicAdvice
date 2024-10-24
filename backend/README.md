# Backend

## backend built based on Epic API
https://fhir.epic.com

## Database Schema

### Table
Users Table

### Data Attributes
 - UserID (Primary Key)
 - FirstName
 - LastName
 - Email
 - Age
 - Gender
 - Ethnicity(to be added)
 - AccountInfo
 - AllergyInfo
 - AppointmentInfo
 - BodyStructure     
 - Region
 - Gender
 - Occupation
 - Careplan
 - FaimilyMemberHistory
 - InfectionCondition
 - MedicationStatement
 - Nutrition(Diet Pattern)
 - ActivityLevel 
 - Occupation                  
 - UserAddress
 - Vaccination (To be determined)                                
                                                          
                       
       

 Note thet the Ethnicity attribute follows coding systems [HL7](https://terminology.hl7.org/CodeSystem-v3-Ethnicity.html) standard, and Occupation attribute follows SNOMED coding

 ### Get Started 
 navigate to `backend/DataBase` directory
 Run: 
 `sqlite3 epicAdvice.db`
 `SELECT * FROM Users WHERE id = 1;`
