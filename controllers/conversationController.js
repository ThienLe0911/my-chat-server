const { Conversation } = require("../models");

exports.createConversation = async (req, res) => {
  try {
    const { participants, isGroup, groupName } = req.body;

    const newConversation = new Conversation({
      participants,
      isGroup: isGroup || false,
      groupName: groupName || "",
    });

    const saved = await newConversation.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Tạo cuộc trò chuyện thất bại", error: err.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "username email avatar");

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getUserConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId).populate(
      "participants",
      "username email avatar"
    );

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.findOrCreateConversation = async (req, res) => {
  try {
    const { participants, isGroup, groupName } = req.body;

    const conversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    if (conversation) {
      return res.json(conversation);
    }

    const newConversation = new Conversation({
      participants,
      isGroup: isGroup || false,
      groupName: groupName || "",
    });

    const saved = await newConversation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};
