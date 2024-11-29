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
 - Careplan
 - FaimilyMemberHistory
 - InfectionCondition
 - MedicationStatement
 - Nutrition(Diet Pattern)
 - ActivityLevel 
 - Occupation                  
 - Address              

### Setting up new database
 Run: 
 `sqlite3 epicAdvice.db`
 `SELECT * FROM Users WHERE id = 1;`
 `SELECT FirstName, LastName, Email, Age, Gender FROM Users;`             
                                                          
                       
       

 Note thet the Ethnicity attribute follows coding systems [HL7](https://terminology.hl7.org/CodeSystem-v3-Ethnicity.html) standard, and Occupation attribute follows SNOMED coding


 # Get Started 
 ## Prerequisites
- Python 3.9 
 navigate to `backend/DataBase` directory

 **Install dependencies:**
    Make sure the required packages are installed:

    brew install portaudio


    pip install flask flask-cors python-dotenv google-generativeai
    pip install flask pillow pytesseract
    brew install tesseract
    pip install pillow
    pip install pyaudio keyboard


## Environment Setup


1, **Create a `.env` file:**
   In the `backend` directory, create a `.env` file with your environment variables. Here’s an example:

   ```plaintext
   API_KEY=your_google_api_key



## Grant Database premission
chmod 644 DataBase/epicAdvice.db
chmod 755 DataBase




