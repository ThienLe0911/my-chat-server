const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    onlineStatus: { type: String, enum: ['online', 'offline', 'typing'], default: 'offline' },
    socketId: { type: String, default: null },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
