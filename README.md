# EpicAdvice

## Development Prerequisites: 
Installed: Python 3.12, IDE of your choice


## Setup
1. Open up Terminal from start menu (Windows) 
2. Type “git clone https://github.com/IntelAntique/EpicAdvice.git”, then close terminal 
3. Open Google Chrome, click on the **Puzzle Piece** Icon, and the bottom should show **Manage Extensions**, click on that. 
4. Near the top left, should say **Load Unpacked**, click on that and a windows explorer window should pop up 
5. Within the context of folder of where you cloned the files at [2.](../../EpicAdvice), go to “./frontend/extension” and click it. 
6. Go to the same folder of [2.] in windows explorer and right click. Click on **Open In Terminal** 
7. Once the Terminal window pops up, type **"cd backend"**, **"flask –app LLM run"** respectively 
8. Go to **uwhealth.org**, and you should see our extension working as intended, have fun. 


## Overview

In "web portals" provided by healthcare organizations, patients are given access to more and more data, like physician and test result notes or care instructions. This is great, but the bulk of these notes are written for other healthcare professionals, and it can be difficult for patients to digest and synthesize this information to properly understand it.

There is a market gap here that our team aim to close by partnering with healthcare organizations to provide a "friendly mode"! We will augment patient portals with an AI- driven plugin, and your product will process this complex health information and simplify it for the patient right inside the browser. We decide to integrate our product into an existing website, and how the patient will interact with it.


With this AI-driven plugin, patients can easily switch to a user-friendly view that simplifies complex medical information, making it more accessible and easier to understand directly in the patient portal.

## Project Structure
```
frontend/
backend/
README.md   

```

## Development Conventions
- Create a branch from `main` to work on the development of feature.
- Once ready to be merged to main, make a pull request.
- Wait for review/approval before merging to main.This practice helps catch potential issues early and ensures code quality.

- Do NOT directly commit any code to the main branch.

- Commit Messages: Write clear, concise commit messages that explain whether you are **developing** certain feature or you are **fixing** some issues and what have you changed. 


