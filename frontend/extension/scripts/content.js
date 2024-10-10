
console.log("Content script has loaded!");
if (window){
    console.log("Y")
}

const chatWidget = document.createElement('div');
chatWidget.innerHTML = `
    <div id="chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <button id="open-chat">Chat</button>
        <div id="chat-box" style="display: none; width: 300px; height: 400px; background: white; border: 1px solid #ccc; padding: 10px;">
            <h4>Chat with Us!</h4>
            <div id="messages"></div>
            <input type="text" id="chat-input" placeholder="Type your message...">
        </div>
    </div>`;
document.body.appendChild(chatWidget);

document.getElementById('open-chat').addEventListener('click', function() {
    document.getElementById('chat-box').style.display = 'block';
});

