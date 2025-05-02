const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const connectDB = require('./config/config');
const authRoutes = require('./routes/authRoutes.js');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*' }
});

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO
const setupSocket = require('./sockets/chatSocket');
setupSocket(io); // Gắn socket logic vào đây

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
