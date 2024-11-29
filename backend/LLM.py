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
import pytesseract # what is this for??
from Audio import record
import pathlib
import sounddevice as sd
import numpy as np
import threading
import wave
import time
import keyboard
import pyaudio

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


recording_thread = None
is_recording = False
frames = []
recording_complete = threading.Event()

chunk = 1024
format = pyaudio.paInt16
channels = 1
rate = 44100
output_filename = "recorded_audio.wav"

def record_audio():
    global is_recording, frames
    frames = []
    p = pyaudio.PyAudio()
    stream = p.open(format=format,
                    channels=channels,
                    rate=rate,
                    input=True,
                    frames_per_buffer=chunk)

    print("Recording...")

    while is_recording:
        data = stream.read(chunk)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    p.terminate()

    file_path = os.path.join(os.path.dirname(__file__), output_filename)
    wf = wave.open(file_path, 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(format))
    wf.setframerate(rate)
    wf.writeframes(b''.join(frames))
    wf.close()

    recording_complete.set() 

@app.route('/audio_response', methods=['POST'])
def audioResponse():
    try:
        print("Audio response")
        recording_complete.wait()
        user_data = get_user_data()
        gender, age, family_member_history, occupation, nutrition = user_data

        ethnicity = "Caucasian"
        highlight = False

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
            The audio file here is my question. Please provide a response.
        """
        media_path = pathlib.Path(__file__).parent / "recorded_audio.wav"
        myfile = genai.upload_file(media_path)
        
        response = model.generate_content([myfile, question])

        return jsonify({'response': response.text}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording_thread, is_recording
    if recording_thread is None or not recording_thread.is_alive():
        is_recording = True
        recording_complete.clear()
        recording_thread = threading.Thread(target=record_audio)
        recording_thread.start()
        return jsonify({'status': 'Recording started'})
    else:
        return jsonify({'status': 'Recording already in progress'})

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global is_recording
    is_recording = False
    recording_thread.join()
    return jsonify({'status': 'Recording stopped', 'file_path': output_filename})

@app.route('/get_response', methods=['POST'])
def get_response():
    data = request.json
    user_input = data.get('user_input')
    highlight = data.get('highlight')

    user_data = get_user_data()
    gender, age, family_member_history, occupation, nutrition = user_data

    ethnicity = "Caucasian"

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
        #print(f"Image uploaded to LLM with file ID: {image_file}")

        # Fetch user data (assuming get_user_data is defined)
        #user_data = get_user_data()
        #gender, age, family_member_history, occupation, nutrition = user_data

        # Generate system instructions for the LLM
        sys_ins = f"""
        You are provided with a screenshot that may contain healthcare lab reports or medical charts. Your job is to:
        1. Identify if the screenshot contains healthcare information.
        2. If it does, provide a detailed summary of the report including:
            - Patient details (if visible)
            - Test results and observations
            - Any important metrics, such as blood sugar levels, cholesterol levels, etc.
            - Summarize in a way that a non-medical professional can understand.
        3. If there is no identifiable medical information, inform the user that no medical chart was found.

        Use simple and clear language, and ensure all medical jargon is explained in layman's terms.
        """
        # "in a way that is:
        # - Appropriate for a {age} year old {gender} child
        # - Extra careful to explain concepts related to {family_member_history} in a gentle way
        # - Mindful of {nutrition} dietary considerations
        # - Using simple language suitable for a {occupation}""

        # Generate content with the LLM using the uploaded image
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=sys_ins)
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
