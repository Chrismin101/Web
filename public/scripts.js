const adminUsername = "minemi"; 

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
        sessionStorage.setItem('username', username);
    }
});

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    const username = sessionStorage.getItem('username');

    if (message && username) {
        const chatBox = document.getElementById('chat-box');

        if (username === adminUsername) {
            const adminMessage = document.createElement('div');
            adminMessage.textContent = `Admin: ${message}`;
            adminMessage.style.fontWeight = 'bold';
            chatBox.appendChild(adminMessage);
        } else {
            const userMessage = document.createElement('div');
            userMessage.textContent = `${username}: ${message}`;
            chatBox.appendChild(userMessage);
            setTimeout(() => {
                const responseMessage = document.createElement('div');
                responseMessage.textContent = `You (Admin): Message from ${username} received.`;
                responseMessage.style.fontStyle = 'italic';
                chatBox.appendChild(responseMessage);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 500);
        }
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
    console.log('Connected to server');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'history') {
        data.messages.forEach((msg) => displayMessage(msg.sender, msg.message));
    } else if (data.type === 'message') {
        displayMessage(data.sender, data.message);
    }
});

document.getElementById('chat-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    const username = sessionStorage.getItem('username');

    if (message && username) {
        socket.send(JSON.stringify({ sender: username, message }));
        messageInput.value = '';
    }
});

function displayMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('div');
    newMessage.textContent = `${sender}: ${message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}
