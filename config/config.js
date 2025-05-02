const mongoose = require("mongoose");
const { User, Message, Conversation } = require("../models"); // { User, Message, Conversation } from "../models";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // dừng server nếu kết nối lỗi
  }
};

module.exports = connectDB;
