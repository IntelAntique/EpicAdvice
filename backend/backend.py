from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os

load_dotenv()
password = os.getenv("password")
db = os.getenv("database")
domain = os.getenv("domain")

DATABASE_URL = f"mysql+pymysql://root:{password}@{domain}/{db}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    gender = Column(String(10))
    age = Column(Integer)
    medical_history = Column(String(1024))
    family_member_history = Column(String(1024))
    ethnicity = Column(String(64))
    occupation = Column(String(32))
    diet = Column(String(1024))
    allergies = Column(String(1024))

Base.metadata.create_all(bind=engine)

def create_user(db: Session, name: str, gender: str, age: int, medical_history: str, family_member_history: str, ethnicity: str, occupation: str, diet: str, allergies: str):
    db_user = User(
        name=name,
        gender=gender,
        age=age,
        medical_history=medical_history,
        family_member_history=family_member_history,
        ethnicity=ethnicity,
        occupation=occupation,
        diet=diet,
        allergies=allergies
    )
    db.add(db_user)
    # print(db.new)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, name: str = None, gender: str = None, age: int = None, medical_history: str = None, family_member_history: str = None, ethnicity: str = None, occupation: str = None, diet: str = None, allergies: str = None):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        if name:
            user.name = name
        if gender:
            user.gender = gender
        if age:
            user.age = age
        if medical_history:
            user.medical_history = medical_history
        if family_member_history:
            user.family_member_history = family_member_history
        if ethnicity:
            user.ethnicity = ethnicity
        if occupation:
            user.occupation = occupation
        if diet:
            user.diet = diet
        if allergies:
            user.allergies = allergies
        db.commit()
        db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user

if __name__ == "__main__":
    db = SessionLocal()
    # new_user = create_user(db, name="Jane Doe", gender="Female", age=28, medical_history="None", family_member_history="None", ethnicity="Asian", occupation="Engineer", diet="Vegetarian", allergies="None")
    # print(new_user)
    # user = get_user(db, user_id=3)
    
    # updated_user = update_user(db, user_id=3, name="Jane Smith")
    # print(updated_user.id, updated_user.name)
    deleted_user = delete_user(db, user_id=3)
    db.close()