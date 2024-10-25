import sqlite3
import os
import json
from datetime import datetime 

sql_file_path = './epicAdvice.sql'
db_path = './epicAdvice.db'

def execute_sql_file(sql_file, conn):
    with open(sql_file, 'r') as file:
        sql_script = file.read()

    # Execute the SQL commands in the file
    conn.executescript(sql_script)
    print("Database created and initialized successfully.")

def calculate_age(birth_date):
    birth_date = datetime.strptime(birth_date, "%Y-%m-%d")
    today = datetime.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


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

def extract_and_insert_details(json_file):
    with open(json_file, 'r') as f:
        json_data = json.load(f)
    
    email = next((item["value"] for item in json_data.get("telecom", []) if item.get("system") == "email"), None)
    
    first_name = json_data.get("name", [{}])[0].get("given", [""])[0]
    last_name = json_data.get("name", [{}])[0].get("family", "")
    
    birth_date = json_data.get("birthDate")
    age = calculate_age(birth_date) if birth_date else None
    
    # Insert extracted data into the database
    cursor.execute("""
        UPDATE Users
        SET Email = ?, FirstName = ?, LastName = ?, Age = ?
        WHERE id = ?
    """, (email, first_name, last_name, age, user_id))
    conn.commit()


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
    'Patient_Read.json': 'UserAddress',
}

# Loop through the JSON files and insert data into the corresponding database columns
for json_file, column_name in json_files_mapping.items():
    file_path = os.path.join(json_dir, json_file)
    if os.path.exists(file_path):
        insert_json_data(file_path, column_name)
    else:
        print(f"File {json_file} does not exist in the directory.")

# Insert the email specifically from the Patient_Read.json file
# patient_json = os.path.join(json_dir, 'Patient_Read.json')
# if os.path.exists(patient_json):
#     extract_and_insert_details(patient_json)
# else:
#     print(f"File Patient_Read.json does not exist in the directory.")


conn.close()