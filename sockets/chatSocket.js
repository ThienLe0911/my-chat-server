const { Message } = require("../models");

module.exports = function (io) {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // Nhận userId từ client và lưu lại socketId
    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("✅ Online users:", Array.from(onlineUsers.keys()));
      socket.broadcast.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("sendMessage", (data) => {
      socket.broadcast.emit("receiveMessage", data);
    });

    socket.on("messagesSeen", (data) => {
      console.log("messagesSeen", data);
      socket.broadcast.emit("messagesSeen", data);
    });

    // Gọi video từ người A
    socket.on("videoCall", ({ offer, conversationId }) => {
      console.log(`📞 Video call offer from ${socket.id} (conversationId: ${conversationId})`);

      const recipientSocketId = Array.from(onlineUsers.values()).find(
        (id) => id !== socket.id
      );

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("videoCall", { offer, conversationId });
      }
    });

    // Người B trả lời cuộc gọi
    socket.on("answerCall", ({ answer, conversationId }) => {
      console.log(`✅ Answer call from ${socket.id} (conversationId: ${conversationId})`);

      const recipientSocketId = Array.from(onlineUsers.values()).find(
        (id) => id !== socket.id
      );

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("answerCall", { answer, conversationId });
      }
    });

    // 🔄 Gửi ICE Candidate giữa hai phía
    socket.on("iceCandidate", ({ candidate, conversationId }) => {
      console.log(`🧊 Candidate from ${socket.id}:`, candidate);

      const recipientSocketId = Array.from(onlineUsers.values()).find(
        (id) => id !== socket.id
      );

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("iceCandidate", { candidate, conversationId });
      }
    });

    // Đóng cuộc gọi
    socket.on("closeVideoCall", ({ conversationId }) => {
      console.log(`📴 Close video call for conversationId: ${conversationId}`);

      const recipientSocketId = Array.from(onlineUsers.values()).find(
        (id) => id !== socket.id
      );

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("closeVideoCall", { conversationId });
      }
    });

    // Ngắt kết nối
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      [...onlineUsers].forEach(([userId, sockId]) => {
        if (sockId === socket.id) onlineUsers.delete(userId);
      });
    });
  });
};
