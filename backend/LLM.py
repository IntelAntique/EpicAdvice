import os
import google.generativeai as genai
from dotenv import load_dotenv

max_temp = 1.0

load_dotenv()
key = os.getenv("API_KEY")

f = open("output.txt", "w")

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content("The opposite of hot is")

# response = model.generate_content(
#     "Tell me a story about a magic backpack.",
#     generation_config=genai.types.GenerationConfig(
#         # Only one candidate for now.
#         candidate_count=1,
        # temperature=1.0,
#     ),
# )

print(response.text)
f.write(f"{response.text}")
f.close()