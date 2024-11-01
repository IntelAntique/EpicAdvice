from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()
db_username = os.getenv("MongoUsername")
db_password = os.getenv("MongoPassword")

connection_string = f"mongodb+srv://{db_username}:{db_password}@cluster0.qohgvyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(connection_string)
db = client["EpicAdvice"]
users_collection = db["Users"]

def create_user(name: str, gender: str, age: int, medical_history: str, family_member_history: str, ethnicity: str, occupation: str, diet: str, allergies: str):
    user = {
        "name": name,
        "gender": gender,
        "age": age,
        "medical_history": medical_history,
        "family_member_history": family_member_history,
        "ethnicity": ethnicity,
        "occupation": occupation,
        "diet": diet,
        "allergies": allergies
    }
    result = users_collection.insert_one(user)
    return users_collection.find_one({"_id": result.inserted_id})

def get_user(user_id: str):
    return users_collection.find_one({"_id": ObjectId(user_id)})

def get_users(skip: int = 0, limit: int = 10):
    return list(users_collection.find().skip(skip).limit(limit))

def update_user(user_id: str, name: str = None, gender: str = None, age: int = None, medical_history: str = None, family_member_history: str = None, ethnicity: str = None, occupation: str = None, diet: str = None, allergies: str = None):
    update_fields = {}
    if name:
        update_fields["name"] = name
    if gender:
        update_fields["gender"] = gender
    if age:
        update_fields["age"] = age
    if medical_history:
        update_fields["medical_history"] = medical_history
    if family_member_history:
        update_fields["family_member_history"] = family_member_history
    if ethnicity:
        update_fields["ethnicity"] = ethnicity
    if occupation:
        update_fields["occupation"] = occupation
    if diet:
        update_fields["diet"] = diet
    if allergies:
        update_fields["allergies"] = allergies
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
    return users_collection.find_one({"_id": ObjectId(user_id)})

def delete_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        users_collection.delete_one({"_id": ObjectId(user_id)})
    return user

if __name__ == "__main__":
    new_user = create_user(name="Jane Doe", gender="Female", age=28, medical_history="None", family_member_history="None", ethnicity="Asian", occupation="Engineer", diet="Vegetarian", allergies="None")
    print(new_user)

    user = get_user(user_id=new_user["_id"])
    print(user)

    updated_user = update_user(user_id=new_user["_id"], name="Jane Smith")
    print(updated_user["_id"], updated_user["name"])

    deleted_user = delete_user(user_id=new_user["_id"])
    print(deleted_user)
