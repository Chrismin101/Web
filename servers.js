require('dotenv').config();
const express = require('express');
const { WebSocketServer } = require('ws');
const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Message Schema
const messageSchema = new mongoose.Schema({
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files for the front-end
app.use(express.static('public'));

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send past messages to the connected client
    Message.find().sort({ timestamp: 1 }).then((messages) => {
        ws.send(JSON.stringify({ type: 'history', messages }));
    });

    ws.on('message', async (data) => {
        const parsed = JSON.parse(data);
        const { sender, message } = parsed;

        // Save message to MongoDB
        const newMessage = new Message({ sender, message });
        await newMessage.save();

        // Broadcast message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ type: 'message', sender, message }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Upgrade HTTP server to WebSocket
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
