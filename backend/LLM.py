import os
import google.generativeai as genai
from dotenv import load_dotenv

max_temp = 1.0

load_dotenv()
key = os.getenv("API_KEY")

f = open("output.txt", "w")

gender = "Male"
age = 5
history = "Obssessive Compulsive Disorder"
ethnicity = "Caucasian"
Occupation = "Student"
diet = "Vegan"
highlight = True

sys_ins = f"""
You summarize lab reports and medical terms in a way that is:
- Appropriate for a {age} year old {gender} child
- Extra careful to explain concepts related to {history} in a gentle, reassuring way
- Mindful of {diet} dietary considerations when discussing nutrition-related results
- Using simple language suitable for a {age} year old {Occupation}
- Including child-friendly analogies and examples
- Avoiding potentially anxiety-triggering medical terminology
- Using positive, encouraging language
- Breaking down complex concepts into very small, digestible pieces
- Using familiar objects and experiences from a {age} year old daily life for comparisons
- {"use at most 3 sentences in the entire response" if (highlight) else "at most one paragraph"}
"""

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash', 
                              system_instruction = sys_ins)

response = model.generate_content("What is autism?")

# response = model.generate_content(
#     "Tell me a story about a magic backpack.",
#     generation_config=genai.types.GenerationConfig(
#         # Only one candidate for now.
#         candidate_count=1,
#         temperature=1.0,
#     ),
# )

print(response.text)
f.write(f"{response.text}")
f.close()
