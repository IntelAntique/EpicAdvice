

Description:
In "web portals" provided by healthcare organizations, patients are given access to more and more data, like physician and test result notes or care instructions. This is great, but the bulk of these notes are written for other healthcare professionals, and it can be difficult for patients to digest and synthesize this information to properly understand it.
There is a market gap here that EpicAdvice team aims to close by introducing AI solutions to provide a "friendly mode"! 


Chatbots with many interactive features and simplified doctor notes are key elements of our solution to bring a friendly touch to MyChart.




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
There is a bug with the push to talk feature where it isn’t able to read/process audio either due to Google’s or the Python files, can be investigated




What is the next work to be done:
Debugging the push to talk feature such multiple recording attempts doesn’t fail with the Gemini API.
