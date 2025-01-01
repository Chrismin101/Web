const adminUsername = "YourAdminUsername"; // Set your admin username here

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
        // Store the user's username
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
            // Admin-specific message handling
            const adminMessage = document.createElement('div');
            adminMessage.textContent = `Admin: ${message}`;
            adminMessage.style.fontWeight = 'bold';
            chatBox.appendChild(adminMessage);
        } else {
            // Regular user message handling
            const userMessage = document.createElement('div');
            userMessage.textContent = `${username}: ${message}`;
            chatBox.appendChild(userMessage);

            // Simulate sending message to admin
            setTimeout(() => {
                const responseMessage = document.createElement('div');
                responseMessage.textContent = `You (Admin): Message from ${username} received.`;
                responseMessage.style.fontStyle = 'italic';
                chatBox.appendChild(responseMessage);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 500);
        }

        // Clear the input field and scroll to the bottom
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

