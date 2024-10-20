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
        <button id="open-chat" class="plugin-button">Chat</button>

        <div id="chatWindow" class="chat-window hidden" style="display: none;">
            <div class="chat-header">
                <h3>Epic Advice</h3>
            </div>
            <div class="chat-messages" id="chatMessages">
            </div>
            <div class="chat-input-area">
                <input type="text" placeholder="Send messages to AI doctor" id="chatInput" />
                <button id="sendButton" class="send-button">Submit</button>
            </div>
            <div class="chat-options">
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

// Modal CSS styles (you can move this to your CSS file)
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
`;
document.head.appendChild(style);


document.getElementById('open-chat').addEventListener('click', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    

    if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'block';
        chatMessages.innerHTML = '';
        const welcomeMessage = document.createElement('p');
        welcomeMessage.textContent = "We are Epic Advice team. How can I help you?";
        welcomeMessage.classList.add('ai-message');
        chatMessages.appendChild(welcomeMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        chatWindow.style.display = 'none';
    }
});


document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    if (message !== '') {
        const newMessage = document.createElement('p');
        newMessage.textContent = message;
        newMessage.classList.add('user-message');
        chatMessages.appendChild(newMessage);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(sendAIMessage, 1000);
    }
}

function sendAIMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const aiResponse = "AI messages";
    const newMessage = document.createElement('p');
    newMessage.textContent = aiResponse;
    newMessage.classList.add('ai-message');
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
