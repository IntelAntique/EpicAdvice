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
        <h1>Doctor's Notes</h1>
        <p>This is the notes section.</p>
    `;
    openModal(notesContent);
});

document.getElementById('summaryButton').addEventListener('click', function() {
    const summaryContent = `
        <h1>Summary</h1>
        <p>This is the summary section.</p>
    `;
    openModal(summaryContent);
});

document.getElementById('planButton').addEventListener('click', function() {
    const planContent = `
        <h1>Current Plan</h1>
        <p>This is the current plan section.</p>
    `;
    openModal(planContent);
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
