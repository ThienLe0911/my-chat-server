const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // hoặc Conversation
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    content: { type: String },
    type: { type: String, enum: ['text', 'image', 'video-call', 'file'], default: 'text' },
    status: { type: String, enum: ['sending', 'sent', 'delivered', 'seen'], default: 'sending' },
    id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
