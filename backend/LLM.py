from flask import Flask, request, jsonify
import os
import json
import sqlite3
from flask.helpers import abort
import base64
from PIL import Image
from io import BytesIO
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS
import pytesseract

load_dotenv()
key = os.getenv("API_KEY")
max_temp = 1.0
genai.configure(api_key=key)

app = Flask(__name__)
#CORS(app)
CORS(app, supports_credentials=True)

DATABASE_PATH = 'DataBase/epicAdvice.db'
@app.route('/')
def home():
    return "Welcome to the AI Response Server!"

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')

    user_data = get_user_data()
    gender, age, family_member_history, occupation, nutrition = user_data

    ethnicity = "Caucasian"
    highlight = True

    sys_ins = f"""
    You summarize lab reports and medical terms in a way that is:
    - Appropriate for a {age} year old {gender} child
    - Extra careful to explain concepts related to {family_member_history} in a gentle, reassuring way
    - Mindful of {nutrition} dietary considerations when discussing nutrition-related results
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


#this function downloads the image to project folder, mainly for testing
@app.route('/upload_image', methods=['POST'])
def upload_image():
    data = request.json
    image_data = data.get('image')

    if image_data:
        # Remove the data URL prefix and decode the image
        image_data = image_data.split(',')[1]  # Remove the "data:image/png;base64," prefix
        image_bytes = base64.b64decode(image_data)

        # Save the image to the local directory
        image = Image.open(BytesIO(image_bytes))
        file_path = 'saved_screenshot.png'
        image.save(file_path)

        return jsonify({'message': 'Image saved successfully!', 'path': file_path}), 200
    else:
        return jsonify({'error': 'No image data received'}), 400



@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json.get('image')
    try:  
        if not data:
            return jsonify({"error": "No image data provided"}), 400

        # Remove the "data:image/png;base64," prefix if present
        if data.startswith('data:image'):
            data = data.split(',')[1]

        # Decode the base64 image data
        image_data = base64.b64decode(data)
        image = Image.open(BytesIO(image_data))

        # Optional: Save the image to a file for debugging
        image.save("received_image.png")

        # Here, you can pass the image to your LLM model for processing
        # For example:
        llm_response = "LLM ready"
        #process_with_llm(image)
        
        return jsonify({"response": llm_response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # # Fetch user data as before
    # user_data = get_user_data()
    # gender, age, family_member_history, occupation, nutrition = user_data
    # ethnicity = "Caucasian"
    # highlight = True
    # sys_ins = f"""
    # You summarize lab reports in a way that is:
    # - Appropriate for a {age} year old {gender} child
    # - Extra careful to explain concepts related to {family_member_history} in a gentle, reassuring way
    # - Mindful of {nutrition} dietary considerations when discussing nutrition-related results
    # - Using simple language suitable for a {age} year old {occupation}
    # - Including child-friendly analogies and examples
    # - Avoiding potentially anxiety-triggering medical terminology
    # - Using positive, encouraging language
    # - Breaking down complex concepts into very small, digestible pieces
    # - Using familiar objects and experiences from a {age} year old daily life for comparisons
    # - {"use at most 3 sentences in the entire response" if (highlight) else "at most one paragraph"}
    # """

    # # Generate a response using the extracted text
    # model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=sys_ins)
    # response = model.generate_content(extracted_text)

    # return jsonify({'response': response})



##helper function to query data from db
def get_user_data():
    try:
        with sqlite3.connect(DATABASE_PATH) as conn:
            cursor = conn.cursor()

            query = "SELECT Age, Gender, FamilyMemberHistory, Occupation, Nutrition FROM Users WHERE id = 1"
            cursor.execute(query)
            user_data = cursor.fetchone()

            if user_data:
                age, gender, history, occupation, nutrition = user_data

                # extract condition_notes
                try:
                    history_json = json.loads(history)
                    condition_notes = history_json.get("condition", [])[0].get("note", [])[0].get("text")
                except (json.JSONDecodeError, IndexError, TypeError) as e:
                    condition_notes = "Unknown"  

                # Extract occupation from Occupation.json if available
                try:
                    occupation_json = json.loads(occupation)
                    occupation = occupation_json.get("valueCodeableConcept", {}).get("coding", [])[0].get("display")
                except (IndexError, KeyError, TypeError):
                    occupation = "Unknown"  

                 # Extract nutrition details from NutritionOrder.json if available
                try:
                    nutrition_order = nutrition["entry"][0]["resource"]["oralDiet"]
                    nutrition_type = nutrition_order["type"][0]["text"]
                    nutrition_texture = nutrition_order["texture"][0]["modifier"]["text"]
                    nutrition_guideline = f"{nutrition_type} diet, {nutrition_texture} texture"
                except (IndexError, KeyError, TypeError):
                    nutrition_guideline = "null" 

                return gender, age, condition_notes, occupation, nutrition_guideline
            else:
                return None
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return None

if __name__ == '__main__':
    app.run(port=5000, debug=True)
