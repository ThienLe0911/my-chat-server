const { Message, User } = require("../models");

exports.sendMessage = async (req, res) => {
  try {
    const { conversation, content, receiver } = req.body;
    console.log('sendMessage',req.body);

    const user = await User.findById(req.user.id);
    const message = new Message({
      sender: user,
      receiver,
      conversation: conversation,
      content,
      status: "sending",
    });

    let saved = await message.save();
    saved.status = "sent";
    saved = await saved.save();
    console.log(saved);
    res.status(201).json({ data: saved, msg: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Lỗi gửi tin nhắn", error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    // get sender from messag
    const messages = await Message.find({ conversation: conversationId })
      .sort({
        createdAt: 1,
      })
      .populate("sender", "username email");
    res.json({ messages, msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi lấy tin nhắn", error: err.message });
  }
};

exports.markMessagesAsSeen = async (req, res) => {
  try {
    const { messageIds } = req.body;
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { status: "seen" } }
    );
    res.json({ msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi đánh dấu seen", error: err.message });
  }
};
