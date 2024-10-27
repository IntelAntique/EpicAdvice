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
                <h3>Epic Advice</h3>
                <button id="close-chat" class="close-chat-button">Close</button>
            </div>
            <div class="chat-messages" id="chatMessages" style="flex: 1; overflow-y: auto; padding: 10px;">
            </div>
            <div class="chat-input-area" style="width: 100%; padding: 10px; box-sizing: border-box;">
                <input type="text" placeholder="Send messages to AI doctor" id="chatInput" />
                <button id="sendButton" class="send-button">Submit</button>
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
    const notesContent = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 70vh; width: 90vw; overflow-y: auto; padding: 20px; border-radius: 10px;">
            <h1 style="text-align: center; opacity: 1; color: white; font-weight: bold;">Doctor's Notes</h1>
            <div class="card-container" style="background-color: rgba(255, 255, 255, 0.2); display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px; border-radius: 10px;">
                ${[{
                    title: "Patient Information",
                    content: `
                        <p><strong>Name:</strong> XXXXX</p>
                        <p><strong>Age:</strong> 25</p>
                        <p><strong>Gender:</strong> male</p>
                    `
                },
                {
                    title: "History",
                    content: `
                        <p>The patient has no known food allergies and no recent changes in diet.</p>
                        <p>There is [no/recent] history of travel and no known contact with sick individuals.</p>
                        <p>No chronic illnesses, and the patient denies taking any new medications.</p>
                    `
                },
                {
                    title: "Physical Examination",
                    content: `
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
                    `
                },
                {
                    title: "Diagnosis",
                    content: `<p>Acute Gastroenteritis</p>`
                },
                {
                    title: "Recommendations",
                    content: `
                        <ul>
                            <li><strong>Hydration:</strong> Encourage the patient to drink plenty of fluids.</li>
                            <li><strong>Diet:</strong> Recommend bland foods such as rice, toast, and bananas.</li>
                            <li><strong>Rest:</strong> Advise the patient to rest and avoid strenuous activities.</li>
                        </ul>
                    `
                }].map(data => `
                    <div class="card" style="text-align: center; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: auto; flex: 1 1 auto;">
                        <h3>${data.title}</h3>
                        <div>${data.content}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    openModal(notesContent);
});


document.getElementById('summaryButton').addEventListener('click', function() {
    const summaryContent = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80vw;
            max-height: 80vh;
            overflow-y: auto;
            padding: 10px;
            border: 1px solid #ccc;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;">
            
            <h1 style="
                font-weight: bold;
                color: white;
                background-color: #333;
                padding: 10px;
                margin: 0;
                text-align: center;
            ">Summary</h1>
            
            <div style="padding: 10px;">
                ${[
                    {
                        title: "Patient Information",
                        content: `
                            <p><strong>Name:</strong> XXXXX</p>
                            <p><strong>Age:</strong> 25</p>
                            <p><strong>Gender:</strong> male</p>
                        `
                    },
                    {
                        title: "Diagnosis",
                        content: `<strong>Acute Gastroenteritis</strong>
                                  <li>This is typically a temporary condition and should improve with proper treatment and care.</li>`
                    },
                    {
                        title: "Physical Examination Results",
                        content: `
                            <p>There is some mild tenderness and increased bowel sounds, which are common with gastroenteritis. However, there is no rebound tenderness or distension, which suggests there are no serious complications like bowel obstruction.</p>
                        `
                    },
                    {
                        title: "Overall Health",
                        content: `
                            Based on the examination, your vital signs such as temperature, blood pressure, heart rate, and respiratory rate are within the normal range. 
                            This indicates that your body is coping well with the illness. There are no signs of severe dehydration, and your oral mucosa and skin turgor are normal, which is a positive sign.
                        `
                    }
                ].map(data => `
                    <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; background: #f9f9f9;">
                        <h3>${data.title}</h3>
                        <div>${data.content}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    openModal(summaryContent);
});



document.getElementById('planButton').addEventListener('click', function() {
    const planDiv = document.createElement('div');
    planDiv.innerHTML = `
        <h2>Today's Health Plan <span style="float: right; font-size: 14px;">Oct 17, 2024</span></h2>
        <br>
        <h3>🩺 Medication</h3>
        <br>
        <p><strong>Amoxicillin</strong><br>Take 1 tablet (50mg) by mouth twice a day (once in the morning and once in the evening) for 10 days.</p>
        <br>
        <p><strong>Nicotine 14MG/24HR Patch</strong><br>Place 1 patch on the skin (one) time each day at the same time.</p>
        <br>
        <br>
        <h3>🌱 Vita’s Care Plan for You</h3>
        <br>
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
    planDiv.style.width = '300px';


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
