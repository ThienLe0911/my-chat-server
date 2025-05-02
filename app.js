const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
// app.use('/api/auth', require('./routes/authRoutes'));

const server = http.createServer(app);

// SOCKET
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// SOCKET LOGIC
// require('./sockets/socketHandler')(io);

module.exports = { app, server };
