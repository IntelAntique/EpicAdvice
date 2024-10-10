document.getElementById('openChatButton').addEventListener('click', function() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
    } else {
        chatWindow.classList.add('hidden');
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
        setTimeout(sendAIMessage, 1000); // Simulate delay for AI response
    }
}

function sendAIMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const aiResponse = "AI messages"; // Simulate AI response before import our API
    const newMessage = document.createElement('p');
    newMessage.textContent = aiResponse;
    newMessage.classList.add('ai-message');
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('sendButton').addEventListener('click', sendMessage);

document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


function openCenteredWindow(url) {
    const width = 400;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
}

document.getElementById('notesButton').addEventListener('click', function() {
    openCenteredWindow('page2_notes.html');
});
document.getElementById('summaryButton').addEventListener('click', function() {
    openCenteredWindow('page2_summary.html');
});
document.getElementById('conditionButton').addEventListener('click', function() {
    openCenteredWindow('page2_condition.html');
});

