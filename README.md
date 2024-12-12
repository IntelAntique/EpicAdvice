# EpicAdvice


## Overview

In "web portals" provided by healthcare organizations, patients are given access to more and more data, like physician and test result notes or care instructions. This is great, but the bulk of these notes are written for other healthcare professionals, and it can be difficult for patients to digest and synthesize this information to properly understand it.

There is a market gap here that our team aim to close by partnering with healthcare organizations to provide a "friendly mode"! We will augment patient portals with an AI- driven plugin, and your product will process this complex health information and simplify it for the patient right inside the browser. We decide to integrate our product into an existing website, and how the patient will interact with it.

## Setup
1. Open up Terminal from start menu (Windows) 
2. Type “git clone https://github.com/IntelAntique/EpicAdvice.git”, then close terminal 
3. Open Google Chrome, click on the **Puzzle Piece** Icon, and the bottom should show **Manage Extensions**, click on that. 
4. Near the top left, should say **Load Unpacked**, click on that and a windows explorer window should pop up 
5. Within the context of folder of where you cloned the files at [2.](../../EpicAdvice), go to “./frontend/extension” and click it. 
6. Go to the same folder of [2.] in windows explorer and right click. Click on **Open In Terminal** 
7. Once the Terminal window pops up, type **"cd backend"**, **"flask –app LLM run"** respectively 
8. Go to **uwhealth.org**, and you should see our extension working as intended, have fun. 

Chatbots with many interactive features and simplified doctor notes are key elements of our solution to bring a friendly touch to MyChart.


## Project Structure
```
frontend/
backend/
    |
    Database
README.md 
```

Link to your repository: https://github.com/IntelAntique/EpicAdvice


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
