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
CORS(app)

DATABASE_PATH = 'DataBase/epicAdvice.db'
@app.route('/')
def home():
    return "Welcome to the AI Response Server!"

def audioResponse():
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
    question = """
    What was said here?
    """
    media_path = pathlib.Path(__file__).parent / "Recorded.wav"
    myfile = genai.upload_file(media_path)
    
    response = model.generate_content([myfile, question])

    return jsonify({'response': response.text})

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

        #Decode the base64 image data
        try:
            image_data = base64.b64decode(data)
            image = Image.open(BytesIO(image_data))
        except Exception as e:
            return jsonify({"error": f"Failed to decode image data: {str(e)}"}), 400

        #Save the image to a file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(current_dir, 'received_image.png')
        try:
            image.save(image_path)
        except Exception as e:
            return jsonify({"error": f"Failed to save image: {str(e)}"}), 500

        try:
            if not os.path.exists(image_path):
                return jsonify({"error": f"Image file not found at {image_path}"}), 404

            image_file = genai.upload_file(path=image_path, display_name="Sample drawing")
        except Exception as e:
            return jsonify({"error": f"Failed to upload image to genai: {str(e)}"}), 500

        #Fetch user data and generate system instructions
        try:
            user_data = get_user_data()
            gender, age, family_member_history, occupation, nutrition = user_data

            sys_ins = f"""
            You summarize lab reports in a way that is:
            - Appropriate for a {age} year old {gender} child
            - Extra careful to explain concepts related to {family_member_history} in a gentle, reassuring way
            - Mindful of {nutrition} dietary considerations when discussing nutrition-related results
            - Using simple language suitable for a {age} year old {occupation}
            - Including child-friendly analogies and examples
            - Avoiding potentially anxiety-triggering medical terminology
            - Using positive, encouraging language
            - Breaking down complex concepts into very small, digestible pieces
            - Using familiar objects and experiences from a {age} year old daily life for comparisons
            """
        except Exception as e:
            return jsonify({"error": f"Error fetching user data: {str(e)}"}), 500

        #Generate a response using the LLM
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(
                ["Describe the image with a creative description.", image_file]
            ).text
        except Exception as e:
            return jsonify({"error": f"Error generating content with LLM: {str(e)}"}), 500

        # Return the LLM response
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route('/upload_screenshot', methods=['POST'])
def upload_screenshot():
    try:
        #print("Request headers:", request.headers)
        #print("Request content type:", request.content_type)
        if 'screenshot' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['screenshot']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the uploaded file to the backend folder
        backend_folder = os.path.dirname(os.path.abspath(__file__))
        if not os.path.exists(backend_folder):
            os.makedirs(backend_folder)

        file_path = os.path.join(backend_folder, 'cropped_screenshot.png')
        file.save(file_path)

        # Upload the saved file to your LLM service
        image_file = genai.upload_file(path=file_path, display_name="Captured Screenshot")
        print(f"Image uploaded to LLM with file ID: {image_file}")

        # Fetch user data (assuming get_user_data is defined)
        #user_data = get_user_data()
        #gender, age, family_member_history, occupation, nutrition = user_data

        # Generate system instructions for the LLM
        sys_ins = f"""
        You summarize healthcare lab reports if there is any in the picture, other indicate user there is nothing to intepret
        """
        # "in a way that is:
        # - Appropriate for a {age} year old {gender} child
        # - Extra careful to explain concepts related to {family_member_history} in a gentle way
        # - Mindful of {nutrition} dietary considerations
        # - Using simple language suitable for a {occupation}""

        # Generate content with the LLM using the uploaded image
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            ["Describe the image with a creative description.", image_file]
        ).text

        print(response)
        # Return the generated response
        return jsonify({"response": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    
def process_image_with_llm():
    return None


if __name__ == '__main__':
    app.run(port=5000, debug=True)
