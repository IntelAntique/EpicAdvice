import sqlite3
import os
import json

sql_file_path = './epicAdvice.sql'
db_path = './epicAdvice.db'

def execute_sql_file(sql_file, conn):
    with open(sql_file, 'r') as file:
        sql_script = file.read()

    # Execute the SQL commands in the file
    conn.executescript(sql_script)
    print("Database created and initialized successfully.")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Users';")
table_exists = cursor.fetchone()
user_id = 1
json_dir = '../API-response/'

if not table_exists:
    execute_sql_file(sql_file_path, conn)

def insert_json_data(json_file, column_name):
    with open(json_file, 'r') as f:
        json_data = json.load(f)

    # Convert JSON to string 
    json_string = json.dumps(json_data) 

    # Update the corresponding column for the user in the database
    cursor.execute(f"UPDATE Users SET {column_name} = ? WHERE id = ?", (json_string, user_id))
    conn.commit()

def extract_and_insert_email(json_file, column_name='Email'):
    with open(json_file, 'r') as f:
        json_data = json.load(f)
    
    # Look for the email address in the 'telecom' field
    for telecom in json_data.get("telecom", []):
        if telecom.get("system") == "email":
            email = telecom.get("value")
            if email:
                # Insert the email into the database
                cursor.execute(f"UPDATE Users SET {column_name} = ? WHERE id = ?", (email, user_id))
                conn.commit()
                print(f"Email {email} inserted into column {column_name}.")
                return
    print(f"No email found in {json_file}")


# Map JSON files to corresponding columns in the database
json_files_mapping = {
    'Billing_Info.json': 'AccountInfo',
    'AllergyIntolerance_read.json': 'AllergyInfo',
    'Appointment_read.json': 'AppointmentInfo',
    'BodyStructure_search.json': 'BodyStructure',
    'CarePlan_read.json': 'Careplan',
    'FamilyMemberHistory_read.json': 'FamilyMemberHistory',
    'InfectionCondition_read.json': 'InfectionCondition',
    'MedicationStatement_read.json': 'MedicationStatement',
    'NutritionOrder.json': 'Nutrition',
    'Observation_Activities of Daily Living.json': 'ActivityLevel',
    'Occupation.json': 'Occupation',
    'Patient_Read.json': 'Address',
}

# Loop through the JSON files and insert data into the corresponding database columns
for json_file, column_name in json_files_mapping.items():
    file_path = os.path.join(json_dir, json_file)
    if os.path.exists(file_path):
        insert_json_data(file_path, column_name)
    else:
        print(f"File {json_file} does not exist in the directory.")

# Insert the email specifically from the Patient_Read.json file
patient_json = os.path.join(json_dir, 'Patient_Read.json')
if os.path.exists(patient_json):
    extract_and_insert_email(patient_json)
else:
    print(f"File Patient_Read.json does not exist in the directory.")


conn.close()