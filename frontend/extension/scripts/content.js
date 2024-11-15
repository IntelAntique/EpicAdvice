console.log("Content script has loaded!");
if (window) {
    console.log("Y");
}

const chatWidget = document.createElement('div');
chatWidget.innerHTML = `
    <div id="chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <button id="open-chat" class="open-chat" style="position: relative;">
            <div id="hover-text" class="hover-text" style="display: none; position: absolute; top: -34px; left: 50%; transform: translateX(-50%); background: #4a90e2; padding: 10px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-size: 19px; color: white; white-space: nowrap; width: auto; max-width: 300px; text-align: center;">I'm Vita, your health guide</div>
            <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="Chat" id="chat-icon" class="chat-icon" />
        </button>

        <div id="chatWindow" class="chat-window hidden" style="display: none; flex-direction: column;">
            <div class="chat-header" style="display: flex; align-items: center; padding: 10px; background-color: #ffffff;">
                <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                <p style="margin: 0; font-size: 14px; flex: 1; text-align: left;">
                    Hi! I'm Vita, your AI health guide. <br> 
                    Need help understanding something? Just ask me! <br>
                    How can I assist you today?</p>
                <button id="close-chat" class="close-chat-button" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            <div class="chat-options" style="width: 100%; padding: 10px; display: flex; flex-direction: column; gap: 10px;">
                <button id="notesButton" class="chat-option" style="background-color: #fddddd; padding: 4px; font-size: 12px; border: 1px solid #f7aaaa; border-radius: 5px; cursor: pointer; width: 40%;">Doctor's notes</button>
                <button id="summaryButton" class="chat-option" style="background-color: #e0f7e9; padding: 4px; font-size: 12px; border: 1px solid #b2dfdb; border-radius: 5px; cursor: pointer; width: 40%;">Summary</button>
                <button id="planButton" class="chat-option" style="background-color: #e6e6fa; padding: 4px; font-size: 12px; border: 1px solid #b2b2d8; border-radius: 5px; cursor: pointer; width: 40%;">Current Plan</button>
            </div>
            <div class="chat-input-area" style="width: 100%; padding: 10px; box-sizing: border-box; display: flex; align-items: center;">
                <input type="text" placeholder="Send messages to AI doctor" id="chatInput" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 12px;" />
                <button id="sendButton" class="send-button" style="margin-left: 5px; padding: 8px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Submit</button>
                <button id="voiceButton" class="voice-button" style="background: none; border: none; cursor: pointer; margin-left: 5px;">
                    <img src="${chrome.runtime.getURL("images/voice.png")}" alt="Voice" id="chat-icon" style="width: 24px; height: 24px;">
                </button>
            </div>
        </div>
    </div>

    <!-- 新的交流窗口 -->
    <div id="chat-imessages" style="display: none; position: fixed; top: 0; right: 0; width: 50%; height: 100%; background-color: #ffffff; z-index: 1001; overflow-y: auto; padding: 20px; box-shadow: -4px 0px 8px rgba(0,0,0,0.1);">
        <div class="imessages-header" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #ddd;">
            <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="AI Image" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
            <p style="font-size: 18px; margin: 0;">Chat with Vita</p>
            <button id="close-imessages" class="close-chat-button" style="margin-left: auto; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div id="chatContent" style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <!-- 用户消息和 AI 回应将在这里显示 还在更新中：） -->
        </div>
        <div class="chat-input-area" style="width: 100%; padding: 10px; box-sizing: border-box; display: flex; align-items: center; border-top: 1px solid #ddd;">
            <input type="text" placeholder="Send a message" id="chatInputImessages" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" />
            <button id="sendButtonImessages" class="send-button" style="margin-left: 10px; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Submit</button>
            <button id="voiceButtonImessages" class="voice-button" style="background: none; border: none; cursor: pointer;">
                <img src="${chrome.runtime.getURL("images/voice.png")}" alt="Voice" style="width: 24px; height: 24px; margin-left: 10px;">
            </button>
        </div>
    </div>
`;

document.body.appendChild(chatWidget);

const style = document.createElement('style');
style.innerHTML = `
.chat-icon {
    width: 200px;
    height: 200px;
}

.chat-window {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 420px;
    height: 350px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.chat-input-area input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
`;
document.head.appendChild(style);


document.getElementById('open-chat').addEventListener('click', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chat-icon');

    if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'flex';
        chatIcon.style.display = 'none';
    }
});

document.getElementById('close-chat').addEventListener('click', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chat-icon');

    chatWindow.style.display = 'none';
    chatIcon.style.display = 'block';
});

document.getElementById('sendButton').addEventListener('click', function() {
    const message = document.getElementById('chatInput').value.trim();
    if (message) {
        showImessagesWindow(message);
    }
});

document.getElementById('close-imessages').addEventListener('click', function() {
    document.getElementById('chat-imessages').style.display = 'none';
    document.getElementById('chat-icon').style.display = 'block';
});

// 显示交流窗口并发送消息
function showImessagesWindow(message) {
    document.getElementById("chatWindow").style.display = "none";
    document.getElementById("chat-imessages").style.display = "block";
    document.getElementById('chatInputImessages').value = '';


    const userMessage = document.createElement('p');
    userMessage.textContent = message;
    userMessage.classList.add('user-message');
    document.getElementById('chatContent').appendChild(userMessage);


    sendMessageToAI(message);
}

//响应交流func
function sendMessageToAI(userInput) {
    fetch('http://127.0.0.1:5000/get_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        const aiResponse = data.response;
        const aiMessage = document.createElement('p');
        aiMessage.textContent = aiResponse;
        aiMessage.classList.add('ai-message');
        document.getElementById('chatContent').appendChild(aiMessage);
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "There was an error. Please try again.";
        errorMessage.classList.add('error-message');
        document.getElementById('chatContent').appendChild(errorMessage);
    });
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

    document.body.appendChild(noteDiv);
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

//summary目前的style
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

// hightlight func
document.addEventListener('mouseup', (event) => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0 && !chatWidget.contains(event.target)) {
        highlightSelection();
        console.log("Captured Highlighted Text:", selectedText);
    }
});

let clickCount = 0;

document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('highlighted') && !chatWidget.contains(event.target)) {
        clickCount++;
        if (clickCount >= 2) {
            clearHighlights();
            clickCount = 0;
        }
    } else {
        clickCount = 0;
    }
});


function highlightSelection() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const highlightSpan = document.createElement('span');
    highlightSpan.classList.add('highlighted');
    highlightSpan.style.backgroundColor = 'yellow';

    const selectedContents = range.cloneContents();
    highlightSpan.appendChild(selectedContents);

    range.deleteContents();
    range.insertNode(highlightSpan);
    selection.removeAllRanges();
}

function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlighted');
    highlightedElements.forEach(element => {
        const parent = element.parentNode;
        while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
    });
}