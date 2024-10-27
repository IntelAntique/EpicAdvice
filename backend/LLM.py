from flask import Flask, request, jsonify
import os
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

@app.route('/')
def home():
    return "Welcome to the AI Response Server!"

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')
    gender = "Male"
    age = 5
    history = "Obsessive Compulsive Disorder"
    ethnicity = "Caucasian"
    occupation = "Student"
    diet = "Vegan"
    highlight = True

    sys_ins = f"""
    You summarize lab reports and medical terms in a way that is:
    - Appropriate for a {age} year old {gender} child
    - Extra careful to explain concepts related to {history} in a gentle, reassuring way
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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
