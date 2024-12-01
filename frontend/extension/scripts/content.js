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
            <!-- Chat Header -->
            <div class="chat-header" style="display: flex; align-items: center; padding: 10px; background-color: #ffffff;">
                <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                <p style="margin: 0; font-size: 14px; flex: 1; text-align: left;">
                    Hi! I'm Vita, your AI health guide. <br> 
                    Need help understanding something? Just ask me! <br>
                    How can I assist you today?
                </p>
                <button id="close-chat" class="close-chat-button" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>

            <!-- Summary Card -->
            <div class="health-summary-card" style="width: calc(100% - 40px); padding: 15px; margin: 10px 20px; border: 1px solid #ccc; border-radius: 12px; background-color:  #F7FAFF; text-align: center; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <button id="summaryButton" style="all: unset; cursor: pointer; font-size: 16px; font-weight: bold; color: #007bff; margin-bottom: 10px;">
                    View Health Summary  >
                </button>
                <div style="position: relative; width: 120px; height: 120px; margin: 0 auto;">
                    <svg viewBox="0 0 36 36" style="transform: rotate(-90deg); width: 100%; height: 100%;">
                        <path
                            d="M18 2.5
                            a 15.5 15.5 0 1 1 0 31
                            a 15.5 15.5 0 1 1 0 -31"
                            fill="none"
                            stroke="#e0e0e0"
                            stroke-width="2.5"
                        ></path>
                        <path
                            d="M18 2.5
                            a 15.5 15.5 0 1 1 0 31
                            a 15.5 15.5 0 1 1 0 -31"
                            fill="none"
                            stroke="#007bff"
                            stroke-width="2.5"
                            stroke-dasharray="100, 100"
                        ></path>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div style="font-size: 20px; font-weight: bold; color: #007bff;">100%</div>
                        <div style="font-size: 14px;">Doctor's Focus</div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px;margin-left: 20px">
                    <button id="screenButton" style="background: none; border: none; cursor: pointer;">
                        <img src="${chrome.runtime.getURL("images/screenshot.png")}" alt="Screen Icon" style="width: 24px; height: 24px;">
                        <span style="font-size: 14px; color: #007bff; font-weight: bold;">Select Area to Explain</span>
                    </button>
            </div>

            <div style="margin-top: 15px;margin-left: 20px">
                    <button id="inputButton" style="background: none; border: none; cursor: pointer;">
                        <img src="${chrome.runtime.getURL("images/input.png")}" alt="Input Icon" style="width: 24px; height: 24px;">
                        <span style="font-size: 14px; color: #007bff; font-weight: bold;">Ask Questions</span>
                    </button>
            </div>

            <div style="margin-top: 15px;margin-left: 20px">
                    <button id="toggle-record" style="background: none; border: none; cursor: pointer;">
                        <img src="${chrome.runtime.getURL("images/voice.png")}" alt="Voice Icon" style="width: 24px; height: 24px;">
                        <span style="font-size: 14px; color: #007bff; font-weight: bold;">Ask Voice Questions</span>
                    </button>
            </div>
        </div>


    <!-- Chat-imessages Window -->
    <div id="chat-imessages" style="display: none; position: fixed; top: 0; right: 0; width: 50%; height: 100%; background-color: #ffffff; z-index: 1001; box-shadow: -4px 0px 8px rgba(0,0,0,0.1);">
        <div class="imessages-header" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #ddd;">
            <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="AI Image" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
            <p style="font-size: 18px; margin: 0;">Chat with Vita</p>
            <button id="close-imessages" class="close-chat-button" style="margin-left: auto; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <!-- Chat Content Area with Scroll -->
        <div id="chatContent" style="flex: 1; padding: 20px; background-color: #f9f9f9; overflow-y: auto; border-radius: 8px; height: calc(100% - 60px); max-height: calc(100% - 100px);">
            <!-- User messages and AI responses will appear here -->
        </div>
        <!-- Fixed Input Area at Bottom -->
        <div class="chat-input-area" style="width: 100%; padding: 10px; box-sizing: border-box; display: flex; align-items: center; border-top: 1px solid #ddd; position: sticky; bottom: 0; background-color: #ffffff;">
            <input 
                type="text" 
                placeholder="Send a message" 
                id="chatInputImessages" 
                style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; margin-right: 0px;" 
            />
            <button 
                id="toggle-record" 
                class="voice-button" 
                style="background: none; border: none; cursor: pointer; flex: 0;">
                <img 
                    src="${chrome.runtime.getURL("images/voice.png")}" 
                    alt="Voice" 
                    style="width: 24px; height: 24px; margin-left: 0px;" 
                />
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
    height: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

#chatContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: calc(100% - 60px); /* Keeps content area from overlapping input */
}

.user-message {
    text-align: right;
    color: #333;
    background-color: #cce5ff;
    padding: 8px 12px;
    border-radius: 8px;
    align-self: flex-end;
    max-width: 60%;
}

.ai-message {
    text-align: left;
    color: #333;
    background-color: #e6e6fa;
    padding: 8px 12px;
    border-radius: 8px;
    align-self: flex-start;
    max-width: 60%;
}

.error-message {
    color: red;
}

.ai-message {
    font-size: 0.9rem; /* Adjust the size as needed */
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


let hasShownWelcomeMessage = false;
document.getElementById('inputButton').addEventListener('click', function(event) {
    document.getElementById("chatWindow").style.display = "none";
    document.getElementById("chat-imessages").style.display = "block";
    if (!hasShownWelcomeMessage) {
        appendMessageToChatContent("Welcome to your AI Doctor Assistant! I'm here to help with any questions or concerns you have about your health.", false);
        hasShownWelcomeMessage = true;
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

document.getElementById('chatInputImessages').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const message = event.target.value.trim();
        if (message) {
            appendMessageToChatContent(message, true);
            sendMessageToAI(message);
            event.target.value = '';
        }
    }
});

document.getElementById('close-imessages').addEventListener('click', function() {
    document.getElementById('chat-imessages').style.display = 'none';
    document.getElementById('chat-icon').style.display = 'block';
});

function showImessagesWindow(message) {
    document.getElementById("chatWindow").style.display = "none";
    document.getElementById("chat-imessages").style.display = "block";

    const userMessage = document.createElement('p');
    userMessage.textContent = message;
    userMessage.classList.add('user-message');
    document.getElementById('chatContent').appendChild(userMessage);

    sendMessageToAI(message);
}

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
        appendMessageToChatContent(aiResponse, false);
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = "There was an error. Please try again.";
        appendMessageToChatContent(errorMessage, false);
    });
}

function appendMessageToChatContent(message, isUser) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    if (isUser) {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('ai-message');
    }
    const chatContent = document.getElementById('chatContent');
    chatContent.appendChild(messageElement);

    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to open modal and display content
function openModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}


// health summary feature
document.getElementById('summaryButton').addEventListener('click', function() {
    const summaryDiv = document.createElement('div');
    fetch('http://127.0.0.1:5000/health_summary_pdf', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error fetching summary: " + data.error);
            return;
        }

        summaryDiv.innerHTML = data.response

        document.getElementById('closeSummary').addEventListener('click', function() {
            summaryDiv.remove();
        });

        });
    
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

//highlighted text
document.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText && !document.getElementById('innerPage')) {
        
        const innerPage = document.createElement('div');
        innerPage.id = 'innerPage';
        innerPage.style.position = 'fixed';
        innerPage.style.left = '60%';
        innerPage.style.top = '50%';
        innerPage.style.transform = 'translate(-50%, -50%)';
        innerPage.style.width = '400px';
        innerPage.style.zIndex = '1001';
        innerPage.style.background = '#fff';
        innerPage.style.border = '1px solid #ddd';
        innerPage.style.padding = '10px';
        innerPage.style.borderRadius = '8px';
        innerPage.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        innerPage.style.cursor = 'move';
        innerPage.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${chrome.runtime.getURL("images/AIPhoto.png")}" alt="AI Icon" 
                     style="width: 32px; height: 32px; border-radius: 50%; margin-right: 10px;">
                <button id="playAudio" style="
                    border: 1px solid #4A90E2;
                    background-color: rgba(74, 144, 226, 0.1);
                    color: #4A90E2;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-right: 10px;
                ">
                    🔊 Play the Audio
                </button>
                <button id="closeInnerPage" style="background: none; border: none; font-size: 16px; cursor: pointer; margin-left: auto;">&times;</button>
            </div>
            <div id="responseContent" style="margin-top: 10px;">Loading response...</div>

            <!-- Buttons Section -->
            <div style="display: flex; align-items: center; margin-top: 20px;">
                <!-- Request New Explanation Button -->
                <button id="requestNewExplanation" style="
                    display: flex; align-items: center;
                    background-color: #4A90E2;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 15px;
                    font-size: 14px;
                    cursor: pointer;
                    flex: 1;
                ">
                    🔄 I still don’t get it, say it another way
                </button>

                <!-- View More Button -->
                <button id="viewMore" style="
                    display: flex; align-items: center;
                    background-color: transparent;
                    color: #333;
                    border: none;
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 14px;
                ">
                    🔍 View more >
                </button>
            </div>
        `;

        document.body.appendChild(innerPage);

        document.getElementById('closeInnerPage').addEventListener('click', function() {
            innerPage.remove();
        });

        function fetchResponse(query) {
            fetch('http://127.0.0.1:5000/get_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_input: query }),
            })
            .then(response => response.json())
            .then(data => {
                const responseContent = document.getElementById('responseContent');
                responseContent.textContent = data.response;
                
                // Play audio functionality
                document.getElementById('playAudio').addEventListener('click', function() {
                    const utterance = new SpeechSynthesisUtterance(data.response);
                    speechSynthesis.cancel(); // Stop any ongoing speech
                    speechSynthesis.speak(utterance);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('responseContent').textContent = "There was an error. Please try again.";
            });
        }

        fetchResponse(selectedText);
        document.getElementById('requestNewExplanation').addEventListener('click', function() {
            fetchResponse(`${selectedText} - please explain it in a different way`);
        });

        document.getElementById('viewMore').addEventListener('click', function() {
            const responseContent = document.getElementById('responseContent').textContent;
            const chatImessages = document.getElementById('chat-imessages');
            chatImessages.style.display = 'block';
            const chatContent = document.getElementById('chatContent');
            const userMessage = document.createElement('p');

            userMessage.textContent = selectedText;
            userMessage.classList.add('user-message');
            chatContent.appendChild(userMessage);

            const aiMessage = document.createElement('p');
            aiMessage.textContent = responseContent;
            aiMessage.classList.add('ai-message');
            chatContent.appendChild(aiMessage);
            chatContent.scrollTop = chatContent.scrollHeight;

            innerPage.remove();
        });

        dragElement(innerPage);
    }
});

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

}

let isRecording = false;

document.getElementById('toggle-record').addEventListener('click', function() {
    if (isRecording) {
        stopRecording();
        setTimeout(() => {
            sendAudioMessage();
        }, 1000);
    } else {
        startRecording();
    }
});

function sendAudioMessage() {
    document.getElementById("chatWindow").style.display = "none";
    document.getElementById("chat-imessages").style.display = "block";
    const chatContent = document.getElementById('chatContent');
    const audioMessage = document.createElement('div');
    audioMessage.classList.add('user-message');
    audioMessage.style.textAlign = 'right';
    audioMessage.innerHTML = `
        <audio controls style="max-width: 200px;">
            <source src="${chrome.runtime.getURL("audio/recorded_audio.wav")}" type="audio/wav">
            Your browser does not support the audio element.
        </audio>
    `;
    chatContent.appendChild(audioMessage);
    chatContent.scrollTop = chatContent.scrollHeight;

    // Delay execution by 10 seconds
    setTimeout(() => {
        fetch('http://127.0.0.1:5000/audio_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const aiResponse = data.response;
            appendMessageToChatContent(aiResponse, false);
        })
        .catch(error => {
            console.error('Fetch error:', error);

            // Replace the waiting message with an error message
            waitingMessage.textContent = 'An error occurred: ' + error.message;
            waitingMessage.classList.add('error-message');
        });
    }, 10000); // Delay for 10 seconds (10,000 milliseconds)
}

    

function startRecording() {
    isRecording = true;
    const button = document.getElementById('toggle-record');
    button.innerHTML = `<img src="${chrome.runtime.getURL("images/voice2.png")}" alt="Voice Icon" style="width: 24px; height: 24px;">
    <span style="font-size: 14px; color: #007bff; font-weight: bold;">Click Again to Stop Recording</span>`;

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
    const button = document.getElementById('toggle-record');
    button.innerHTML = `<img src="${chrome.runtime.getURL("images/voice.png")}" alt="Voice Icon" style="width: 24px; height: 24px;">
    <span style="font-size: 14px; color: #007bff; font-weight: bold;">Ask Voice Questions</span>`;

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



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "chatbot_response") {
        console.log(request.response)
        const chatContent = document.getElementById('chatContent');
        const aiMessage = document.createElement('p');
            aiMessage.textContent = request.response;
            aiMessage.classList.add('ai-message');
        if (chatContent) {
            chatContent.appendChild(aiMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        }
        
        //appendMessageToChatContent(request.response, true);
        //showChatbotResponse("Chatbot: " + request.response);
    }
});
// Existing code omitted for brevity...

//截图：）
document.getElementById('screenButton').addEventListener('click', function() {
    startScreenCaptureWithSelection();
});

function startScreenCaptureWithSelection() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '10000';
    overlay.style.cursor = 'crosshair';
    document.body.appendChild(overlay);

    let startX, startY, selectionBox;

    overlay.addEventListener('mousedown', function (e) {
        startX = e.clientX;
        startY = e.clientY;
        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = '2px dashed #fff';
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        overlay.appendChild(selectionBox);
    });

    overlay.addEventListener('mousemove', function (e) {
        if (selectionBox) {
            const currentX = e.clientX;
            const currentY = e.clientY;
            selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
            selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
            selectionBox.style.left = `${Math.min(startX, currentX)}px`;
            selectionBox.style.top = `${Math.min(startY, currentY)}px`;
        }
    });

    overlay.addEventListener('mouseup', function (e) {
        const endX = e.clientX;
        const endY = e.clientY;
        document.body.removeChild(overlay);
        
        const rect = {
            left: Math.min(startX, endX),
            top: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY)
        };

        captureSelectedArea(rect);
    });
}

function captureSelectedArea(rect) {
    html2canvas(document.body, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY
    }).then(canvas => {
        canvas.toBlob(blob => {
            const formData = new FormData();
            formData.append('screenshot', blob, 'screenshot.png');

            const chatImessages = document.getElementById('chat-imessages');
            chatImessages.style.display = 'block';

            const chatContent = document.getElementById('chatContent');
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(blob);
            imgElement.style.maxWidth = '100%';
            imgElement.style.border = '1px solid #ddd';
            imgElement.style.borderRadius = '8px';
            imgElement.style.marginBottom = '10px';
            chatContent.appendChild(imgElement);
            chatContent.scrollTop = chatContent.scrollHeight;

            fetch('http://127.0.0.1:5000/upload_screenshot', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
              .then(data => {
                  if (data.response) {
                      const aiMessage = document.createElement('p');
                      aiMessage.textContent = data.response;
                      aiMessage.classList.add('ai-message');
                      chatContent.appendChild(aiMessage);
                      chatContent.scrollTop = chatContent.scrollHeight;
                  } else {
                      const errorMessage = document.createElement('p');
                      errorMessage.textContent = 'AI did not return a response.';
                      errorMessage.classList.add('error-message');
                      chatContent.appendChild(errorMessage);
                      chatContent.scrollTop = chatContent.scrollHeight;
                  }
              }).catch(error => {
                  console.error('Error uploading screenshot:', error);
                  const errorMessage = document.createElement('p');
                  errorMessage.textContent = 'There was an error processing your screenshot. Please try again.';
                  errorMessage.classList.add('error-message');
                  chatContent.appendChild(errorMessage);
                  chatContent.scrollTop = chatContent.scrollHeight;
              });
        }, 'image/png');
    }).catch(error => {
        console.error('Error capturing selected area:', error);
        const chatContent = document.getElementById('chatContent');
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'There was an error capturing your screenshot. Please try again.';
        errorMessage.classList.add('error-message');
        chatContent.appendChild(errorMessage);
        chatContent.scrollTop = chatContent.scrollHeight;

    });
}

