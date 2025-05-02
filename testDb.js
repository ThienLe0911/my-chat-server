const mongoose = require("mongoose");
const { User, Message, Conversation } = require("./models/index");

// ✅ URL MongoDB bạn đang dùng
async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Đã kết nối MongoDB");

    // 🔹 Tạo user demo
    const userA = await User.create({
      username: "alice",
      email: "alice@example.com",
      password: "123456",
    });

    const userB = await User.create({
      username: "bob",
      email: "bob@example.com",
      password: "123456",
    });

    // 🔹 Tạo cuộc trò chuyện
    const conversation = await Conversation.create({
      participants: [userA._id, userB._id],
      isGroup: false,
    });

    // 🔹 Gửi 1 tin nhắn mẫu
    const message = await Message.create({
      sender: userA._id,
      receiver: userB._id,
      conversation: conversation._id,
      content: "Xin chào Bob!",
      status: "sent",
    });

    console.log("✅ Test dữ liệu đã được tạo thành công:");
    console.log({ userA, userB, conversation, message });

    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    process.exit(1);
  }
}

testDatabase();
