# EpicAdvice


## Overview

In "web portals" provided by healthcare organizations, patients are given access to more and more data, like physician and test result notes or care instructions. This is great, but the bulk of these notes are written for other healthcare professionals, and it can be difficult for patients to digest and synthesize this information to properly understand it.

There is a market gap here that our team aim to close by partnering with healthcare organizations to provide a "friendly mode"! We will augment patient portals with an AI- driven plugin, and your product will process this complex health information and simplify it for the patient right inside the browser. We decide to integrate our product into an existing website, and how the patient will interact with it.

Repository link: https://github.com/IntelAntique/EpicAdvice

## Setup
**Install dependencies:**
    Make sure to run the command below to install the required packages:

    brew install portaudio
    pip install flask flask-cors python-dotenv google-generativeai
    pip install flask pillow pytesseract
    brew install tesseract
    pip install pillow
    pip install pyaudio keyboard numpy

**GET API Key**
https://ai.google.dev/gemini-api/docs?gad_source=1&gbraid=0AAAAACn9t64wgcFB9jX-pZ3W4st5OrY06&gclid=CjwKCAiAjeW6BhBAEiwAdKltMmXaCTRjFEaNoo_hXo6TyUFDJy2ac20Ruou3MLOIammJb2pt53MSzhoCvQ8QAvD_BwE
save as API_KEY.env in the `backend` folder
    
1. Open up Terminal from start menu (Windows) 
2. Type “git clone https://github.com/IntelAntique/EpicAdvice.git”, then close terminal 
3. Open Google Chrome, click on the **Puzzle Piece** Icon, and the bottom should show **Manage Extensions**, click on that. 
4. Near the top left, should say **Load Unpacked**, click on that and a windows explorer window should pop up 
5. Within the context of folder of where you cloned the files at [2.](../../EpicAdvice), go to “./frontend/extension” and click it. 
6. Go to the same folder of [2.] in windows explorer and right click. Click on **Open In Terminal** 
7. Once the Terminal window pops up, type **"cd backend"**, navigate to `DataBase` directory and run `insert.py`, then go back to backend folder and type  **"flask –app LLM run"**.
8. Go to **uwhealth.org**, and you should see our extension working as intended, have fun. 

Chatbots with many interactive features and simplified doctor notes are key elements of our solution to bring a friendly touch to MyChart.


## Project Structure
```
├─ frontend/
├─  backend/
|   ├─ Database
|   |  ├─epicAdvic.db
|   |  ├─Doctor_Progress_Notes.pdf   --Doctor Notes
|   |  └─insert.py                   --Python script for creating database
|   ├─ API_KEY.env
|   ├─ Audio.py                      --Python script for audio processing
|   ├─ LLM.py                        --Project backend server
|   └─ API-response                  --Sample API response collected form Epic Fhir API
└─README.md 

```




Prerequisites: 
Visual Studio Code, Python installed 
Setup steps:
Open up Terminal from start menu (Windows)
Type “git clone https://github.com/IntelAntique/EpicAdvice.git”, then close terminal
Open Google Chrome, click on , and the bottom should show Manage Extensions, click on that.
Near the top left, should say Load Unpacked, click on that and a windows explorer window should pop up
Within the context of folder of where you cloned the files at [2.](../../EpicAdvice), go to “./frontend/extension” and click it.
Go to the same folder of (2.) in windows explorer and right click. Click on “Open In Terminal”
Once the Terminal window pops up, type “cd backend”, “flask –app LLM run” respectively
Go to uwhealth.org, and you should see our extension working as intended, have fun.


Pseudocode of individual modules in code:


What works:
Push to talk feature on the microphone icon records your audio to be processed back with an google Gemini response
Typing into the message bar will give back a typical response
Click on our additional pages will present an additional page for additional information (doctor’s notes, summary, care plan)
What doesn’t:
Everytime the program starts we need to recreate a database




What is the next work to be done:
Optimize database access
