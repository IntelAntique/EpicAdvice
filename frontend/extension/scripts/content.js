console.log("Content script has loaded!");
if (window) {
    console.log("Y");
}

const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = chrome.runtime.getURL("scripts/page1.css");
document.head.appendChild(linkElement);
console.log("CSS file loaded from:", linkElement.href);

const chatWidget = document.createElement('div');
chatWidget.innerHTML = `
    <div id="chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <button id="open-chat" class="open-chat" style="position: relative;">
            <div id="hover-text" class="hover-text" style="display: none; position: absolute; top: -34px; left: 50%; transform: translateX(-50%); background: #4a90e2; padding: 10px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-size: 19px; color: white; white-space: nowrap; width: auto; max-width: 300px; text-align: center;">I'm Vita, your health guide</div>
            <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="Chat" id="chat-icon" class="chat-icon" />
        </button>

        <div id="chatWindow" class="chat-window hidden" style="display: none; flex-direction: column;">
            <div class="chat-header">
                <h5>Epic Advice</h5>
                <button id="close-chat" class="close-chat-button">Close</button>
            </div>
            <div class="chat-messages" id="chatMessages" style="flex: 1; overflow-y: auto; padding: 10px;">
            </div>
            <div class="chat-input-area" style="width: 100%; padding: 10px; box-sizing: border-box;">
                <input type="text" placeholder="Send messages to AI doctor" id="chatInput" />
                <button id="sendButton" class="send-button">Submit</button>
                <button id="toggle-record">🎤</button>
            </div>
            <div class="chat-options" style="width: 100%; padding: 10px; box-sizing: border-box; display: flex; justify-content: space-around;">
                <button id="notesButton" class="chat-option">Doctor's notes</button>
                <button id="summaryButton" class="chat-option">Summary</button>
                <button id="planButton" class="chat-option">Current Plan</button>
            </div>    
        </div>
    </div>

    <div id="modal" class="modal" style="display: none;">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div id="modal-body"></div>
        </div>
    </div>
`;
document.body.appendChild(chatWidget);

const style = document.createElement('style');
style.innerHTML = `
.modal {
    display: none; 
    position: fixed; 
    z-index: 1001; 
    left: 0; 
    top: 0; 
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgba(0,0,0,0.5); 
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto; 
    padding: 20px; 
    border: 1px solid #888;
    width: 50%; 
    max-width: 600px;
    border-radius: 10px;
}

.close-button {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close-button:hover,
.close-button:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.close-chat-button {
    background: none;
    border: none;
    color: #aaa;
    font-size: 18px;
    cursor: pointer;
}
.close-chat-button:hover {
    color: black;
}

.chat-icon {
    width: 200px;
    height: 200px;
}

.hover-text {
    font-family: Arial, sans-serif;
    color: #333;
    position: relative;
    background: #4a90e2;
    color: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    font-size: 12px;
    white-space: nowrap;
    width: auto;
    max-width: 300px;
    text-align: center;
}

.chat-window {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
}

.chat-input-area input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.send-button {
    margin-left: 10px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.send-button:hover {
    background-color: #45a049;
}

.chat-options button {
    padding: 10px 20px;
    background-color: #f1f1f1;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.chat-options button:hover {
    background-color: #e1e1e1;
}

.ai-message {
    font-size: 0.9rem; /* Adjust the size as needed */
}
`;
document.head.appendChild(style);


document.getElementById('open-chat').addEventListener('click', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatIcon = document.getElementById('chat-icon');

    if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'flex';
        chatIcon.style.display = 'none';
        chatMessages.innerHTML = '';
        const welcomeMessage = document.createElement('p');
        welcomeMessage.textContent = "We are Epic Advice team. How can I help you?";
        welcomeMessage.classList.add('ai-message');
        chatMessages.appendChild(welcomeMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

document.getElementById('close-chat').addEventListener('click', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chat-icon');

    chatWindow.style.display = 'none';
    chatIcon.style.display = 'block';
});

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


// modifying as part of the project integration
//most important func!!! do not update!!!
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();

    if (message !== '') {
        const userMessage = document.createElement('p');
        userMessage.textContent = message;
        userMessage.classList.add('user-message');
        chatMessages.appendChild(userMessage);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;        
        
        fetch('http://127.0.0.1:5000/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: message }),
        })
        .then(response => {
            if (!response.ok) {
                console.log(response.json())
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const aiResponse = data.response;
            const aiMessage = document.createElement('p');
            aiMessage.textContent = aiResponse;
            aiMessage.classList.add('ai-message');
            chatMessages.appendChild(aiMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = "There was an error. Please try again.";
            errorMessage.classList.add('error-message');
            chatMessages.appendChild(errorMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
}


// Function to open modal and display content
function openModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

// Attach event listeners to buttons to show modal with different content
document.getElementById('notesButton').addEventListener('click', function() {
    const noteDiv = document.createElement('div');
    noteDiv.innerHTML = `
        <h3 style="text-align: center; font-weight: bold;">Doctor's Notes</h3>
        <div style="padding: 20px; color: black;">
            <h5>Patient Information</h5>
            <p><strong>Name:</strong> XXXXX</p>
            <p><strong>Age:</strong> 25</p>
            <p><strong>Gender:</strong> male</p>
            
            <h5>History</h5>
            <p>The patient has no known food allergies and no recent changes in diet.</p>
            <p>There is [no/recent] history of travel and no known contact with sick individuals.</p>
            <p>No chronic illnesses, and the patient denies taking any new medications.</p>
            
            <h5>Physical Examination</h5>
            <p><strong>Vital Signs:</strong></p>
            <ul>
                <li>Temperature: 1000</li>
                <li>Blood Pressure: 1000</li>
                <li>Heart Rate: 100/min</li>
                <li>Respiratory Rate: 6/min</li>
            </ul>
            <p><strong>Abdominal Examination:</strong></p>
            <p>Increased bowel sounds and mild tenderness upon palpation, no rebound tenderness.</p>
            <p>Other Findings: No signs of dehydration, oral mucosa is moist, skin turgor is normal.</p>
            
            <h5>Diagnosis</h5>
            <p>Acute Gastroenteritis</p>
            
            <h5>Recommendations</h5>
            <ul>
                <li><strong>Hydration:</strong> Encourage the patient to drink plenty of fluids.</li>
                <li><strong>Diet:</strong> Recommend bland foods such as rice, toast, and bananas.</li>
                <li><strong>Rest:</strong> Advise the patient to rest and avoid strenuous activities.</li>
            </ul>
            <div style="text-align: center; margin-top: 10px;">
                <button id="closeNote" style="padding: 5px 10px; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    noteDiv.style.position = 'fixed';
    noteDiv.style.bottom = '20px';
    noteDiv.style.right = 'calc(40px + 400px)';
    noteDiv.style.zIndex = '1000';
    noteDiv.style.background = '#fff';
    noteDiv.style.padding = '20px';
    noteDiv.style.borderRadius = '8px';
    noteDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    noteDiv.style.width = '600px';
    noteDiv.style.height = '600px';
    noteDiv.style.overflowY = 'auto';

    // Append to body first
    document.body.appendChild(noteDiv);

    // Now add the event listener
    document.getElementById('closeNote').addEventListener('click', function() {
        noteDiv.remove();
    });
});




document.getElementById('summaryButton').addEventListener('click', function() {
    const summaryDiv = document.createElement('div');
    summaryDiv.innerHTML = `
        <h3 style="text-align: center; font-weight: bold; padding: 10px;">Summary</h3>
        <div style="padding: 20px;">
            <h5>Patient Information</h5>
            <p><strong>Name:</strong> XXXXX</p>
            <p><strong>Age:</strong> 25</p>
            <p><strong>Gender:</strong> male</p>
            
            <h5>Diagnosis</h5>
            <p><strong>Acute Gastroenteritis</strong></p>
            <ul>
                <li>This is typically a temporary condition and should improve with proper treatment and care.</li>
            </ul>
            
            <h5>Physical Examination Results</h5>
            <p>There is some mild tenderness and increased bowel sounds, which are common with gastroenteritis. However, there is no rebound tenderness or distension, which suggests there are no serious complications like bowel obstruction.</p>
            
            <h5>Overall Health</h5>
            <p>Based on the examination, your vital signs such as temperature, blood pressure, heart rate, and respiratory rate are within the normal range. This indicates that your body is coping well with the illness. There are no signs of severe dehydration, and your oral mucosa and skin turgor are normal, which is a positive sign.</p>
            
            <div style="text-align: center; margin-top: 10px;">
                <button id="closeSummary" style="padding: 5px 10px; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;

    // Apply styles directly to the summaryDiv
    summaryDiv.style.position = 'fixed';
    summaryDiv.style.bottom = '20px';
    summaryDiv.style.right = 'calc(40px + 400px)';
    summaryDiv.style.zIndex = '1000';
    summaryDiv.style.background = '#fff';
    summaryDiv.style.padding = '20px';
    summaryDiv.style.borderRadius = '8px';
    summaryDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    summaryDiv.style.width = '600px';
    summaryDiv.style.height = '600px';
    summaryDiv.style.overflowY = 'auto';

    document.body.appendChild(summaryDiv);

    // Add close functionality
    document.getElementById('closeSummary').addEventListener('click', function() {
        summaryDiv.remove();
    });
});

document.getElementById('planButton').addEventListener('click', function() {
    const planDiv = document.createElement('div');
    planDiv.innerHTML = `
        <p>Today's Health Plan <span style="float: right; font-size: 10px;">Oct 17, 2024</span></p>
        <p>🩺 Medication</p>
        <p><strong>Amoxicillin</strong><br>Take 1 tablet (50mg) by mouth twice a day (once in the morning and once in the evening) for 10 days.</p>
        <p><strong>Nicotine 14MG/24HR Patch</strong><br>Place 1 patch on the skin (one) time each day at the same time.</p>
        <p>🌱 Vita’s Care Plan for You</p>
        <ul>
            <li>Avoid cold drinks or caffeine, which can irritate your throat.</li>
            <li>Eat soft, non-spicy foods that are easy on your throat, like soup or yogurt.</li>
            <li>If your symptoms do not improve in 3–5 days, schedule a follow-up appointment.</li>
        </ul>
        <div style="text-align: center; margin-top: 10px;">
            <button id="closePlan" style="padding: 5px 10px; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
    `;
    planDiv.style.position = 'fixed';
    planDiv.style.bottom = '20px';
    planDiv.style.right = 'calc(40px + 400px)';
    planDiv.style.zIndex = '1000';
    planDiv.style.background = '#fff';
    planDiv.style.padding = '20px';
    planDiv.style.borderRadius = '8px';
    planDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    planDiv.style.width = '400px';
    planDiv.style.height = '600px';
    planDiv.style.overflowY = 'auto'; 


    document.body.appendChild(planDiv);
    document.getElementById('closePlan').addEventListener('click', function() {
        planDiv.remove();
    });
});


// Close modal when clicking the close button
document.querySelector('.close-button').addEventListener('click', function() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Show hover text when mouse enters the chat icon area
document.getElementById('chat-icon').addEventListener('mouseenter', function() {
    document.getElementById('hover-text').style.display = 'block';
});

// Hide hover text when mouse leaves the chat icon area
document.getElementById('chat-icon').addEventListener('mouseleave', function() {
    document.getElementById('hover-text').style.display = 'none';
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// functions for taking pictures
let stream;
let startX, startY, endX, endY;
let isSelecting = false;
const selectionBox = document.createElement('div');

// Create a button to start the capture process
const captureButton = document.createElement('button');
captureButton.id = 'capture-button';
captureButton.textContent = 'Capture Screenshot';
captureButton.style.position = 'fixed';
captureButton.style.bottom = '20px';
captureButton.style.left = '20px';
captureButton.style.zIndex = '9999';
captureButton.style.padding = '10px';
captureButton.style.backgroundColor = '#4CAF50';
captureButton.style.color = 'white';
captureButton.style.border = 'none';
captureButton.style.borderRadius = '5px';
captureButton.style.cursor = 'pointer';
document.body.appendChild(captureButton);

captureButton.addEventListener('click', async () => {
    await startScreenCapture();
});

selectionBox.id = 'selection-box';
selectionBox.style.position = 'absolute';
selectionBox.style.border = '2px dashed #00f';
selectionBox.style.display = 'none';
selectionBox.style.pointerEvents = 'none';
document.body.appendChild(selectionBox);

async function startScreenCapture() {
    try {
        // Capture the screen using the Screen Capture API
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const bitmap = await imageCapture.grabFrame();

        // Draw the captured screen on a canvas
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        
        // Allow user to select an area
        document.addEventListener('mousedown', startSelection);
        document.addEventListener('mouseup', endSelection);
        
        // Store the canvas for cropping later
        captureCanvas = canvas;
        captureContext = context;
    } catch (err) {
        console.error('Error capturing screen:', err);
    }
}

function startSelection(event) {
    isSelecting = true;
    startX = event.clientX;
    startY = event.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';

    document.addEventListener('mousemove', resizeSelection);
}

function resizeSelection(event) {
    if (!isSelecting) return;
    const width = event.clientX - startX;
    const height = event.clientY - startY;
    selectionBox.style.width = `${Math.abs(width)}px`;
    selectionBox.style.height = `${Math.abs(height)}px`;
    selectionBox.style.left = `${Math.min(startX, event.clientX)}px`;
    selectionBox.style.top = `${Math.min(startY, event.clientY)}px`;
}

function endSelection(event) {
    isSelecting = false;
    endX = event.clientX;
    endY = event.clientY;

    document.removeEventListener('mousemove', resizeSelection);
    document.removeEventListener('mousedown', startSelection);
    document.removeEventListener('mouseup', endSelection);

    // Crop the selected area and send to backend
    cropAndSendToBackend();
}

async function cropAndSendToBackend() {
    const [x, y, width, height] = [
        Math.min(startX, endX),
        Math.min(startY, endY),
        Math.abs(endX - startX),
        Math.abs(endY - startY)
    ];

    // Create a cropped canvas
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const croppedContext = croppedCanvas.getContext('2d');
    croppedContext.drawImage(captureCanvas, x, y, width, height, 0, 0, width, height);

    // Convert the cropped canvas to a Blob
    const blob = await new Promise((resolve) => croppedCanvas.toBlob(resolve, 'image/png'));

    // Stop the screen capture stream
    stream.getTracks().forEach(track => track.stop());

    // Upload the cropped image to the backend
    const formData = new FormData();
    formData.append('screenshot', blob, 'cropped_screenshot.png');

    try {
        const response = await fetch('http://127.0.0.1:5000/upload_screenshot', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log('Upload successful:', result);
    } catch (error) {
        console.error('Failed to upload screenshot:', error);
    }

    selectionBox.style.display = 'none';
}

document.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && event.target.tagName !== 'BUTTON') {
        fetch('http://127.0.0.1:5000/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: selectedText, highlight: true }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response:', text);
                    throw new Error('Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            const aiResponse = data.response;
            showModal(event.pageX, event.pageY, aiResponse);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }
});

function showModal(x, y, message) {
    const modal = document.createElement('div');
    modal.style.position = 'absolute';
    modal.style.left = `${x}px`;
    modal.style.top = `${y}px`;
    modal.style.width = '25%'; // Set the width to a quarter of the screen
    modal.style.padding = '10px';
    modal.style.backgroundColor = '#1e3a5f'; // Dark cool blue background
    modal.style.color = 'white'; // Bright white text
    modal.style.border = '1px solid #0d253f'; // Slightly darker border
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    modal.style.zIndex = 1000;
    modal.style.transition = 'opacity 0.5s';
    modal.style.opacity = 0;

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    modal.appendChild(messageParagraph);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#0d253f'; // Darker blue for the button
    closeButton.style.color = 'white'; // White text for the button
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        modal.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 500);
    };
    modal.appendChild(closeButton);

    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = 1;
    }, 0);
}

let isRecording = false;

document.getElementById('toggle-record').addEventListener('click', function() {
    if (isRecording) {
        stopRecording();
        sendAudioMessage();
    } else {
        startRecording();
    }
});

function sendAudioMessage() {
    const chatMessages = document.getElementById('chatMessages');

    const userMessage = document.createElement('p');
    userMessage.textContent = 'Sending audio message...';
    userMessage.classList.add('user-message');
    chatMessages.appendChild(userMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetch('http://127.0.0.1:5000/audio_response', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(text => {
                console.error('Error response:', text);
                throw new Error('Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        const aiResponse = data.response;
        const aiMessage = document.createElement('p');
        aiMessage.textContent = aiResponse;
        aiMessage.classList.add('ai-message');
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function startRecording() {
    isRecording = true;
    document.getElementById('toggle-record').textContent = '🎤';
    document.getElementById('toggle-record').style.opacity = "0.5";

    fetch('http://127.0.0.1:5000/start_recording', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.status);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function stopRecording() {
    isRecording = false;
    document.getElementById('toggle-record').textContent = '🎤';
    document.getElementById('toggle-record').style.opacity = "1"

    fetch('http://127.0.0.1:5000/stop_recording', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.status);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}