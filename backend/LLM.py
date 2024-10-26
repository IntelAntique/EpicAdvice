from flask import Flask, request, jsonify
import os
import json
import sqlite3
from flask.helpers import abort
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
key = os.getenv("API_KEY")
max_temp = 1.0
genai.configure(api_key=key)

app = Flask(__name__)
CORS(app)
DATABASE_PATH = 'Database/epicAdvice.db'

@app.route('/')
def home():
    return "Welcome to the AI Response Server!"

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')

    user_data = get_user_data()
    gender, age, family_member_history, occupation, diet = user_data

    ethnicity = "Caucasian"
    highlight = True

    sys_ins = f"""
    You summarize lab reports and medical terms in a way that is:
    - Appropriate for a {age} year old {gender} child
    - Extra careful to explain concepts related to {family_member_history} in a gentle, reassuring way
    - Mindful of {diet} dietary considerations when discussing nutrition-related results
    - Using simple language suitable for a {age} year old {occupation}
    - Including child-friendly analogies and examples
    - Avoiding potentially anxiety-triggering medical terminology
    - Using positive, encouraging language
    - Breaking down complex concepts into very small, digestible pieces
    - Using familiar objects and experiences from a {age} year old daily life for comparisons
    - {"use at most 3 sentences in the entire response" if (highlight) else "at most one paragraph"}
    """

    model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=sys_ins)
    response = model.generate_content(user_input)

    return jsonify({'response': response.text})


##helper function
def get_user_data():
    try:
        with sqlite3.connect(DATABASE_PATH) as conn:
            cursor = conn.cursor()

            query = "SELECT Gender, Age, FamilyMemberHistory, Occupation, Nutrition FROM Users WHERE id = 1"
            cursor.execute(query)
            user_data = cursor.fetchone()

            if user_data:
                gender, age, history, occupation, diet = user_data

                # Parse the FamilyMemberHistory JSON to extract condition_notes
                try:
                    history_json = json.loads(history)
                    condition_notes = history_json.get("condition", [])[0].get("note", [])[0].get("text")
                except (json.JSONDecodeError, IndexError, TypeError) as e:
                    condition_notes = "Unknown"  

                return gender, age, condition_notes, occupation, diet
            else:
                return None
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return None

if __name__ == '__main__':
    app.run(port=5000, debug=True)
