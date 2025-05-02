const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Conversation } = require("../models");
const { where } = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ msg: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Sai mật khẩu" });

    // Cập nhật trạng thái online
    await User.findByIdAndUpdate(user._id, { onlineStatus: "online" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ msg: "Đăng nhập thành công", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, {
      onlineStatus: "offline",
      lastSeen: new Date(),
      socketId: null,
    });

    res.json({ msg: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// exports.getUsers = async (req, res) => {
//   const { searchValue } = req.body;
//   try {
//     const user = await User.find({
//       username: { $regex: searchValue, $options: "i" },
//     });
//     res.json({ data: user, msg: "Success" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Lỗi server", error: err.message });
//   }
// };
exports.getUsers = async (req, res) => {

  try {
    const userId = req.user.id;
    console.log('userid',userId)
    const {searchValue} = req.body;

    if (!searchValue) {
      return res.status(400).json({ message: "Missing searchValue parameter" });
    }

    // 1. Lấy các conversation mà user hiện tại tham gia
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "username avatar")
      .lean();

    // 2. Lọc các conversation khớp với searchValue (theo tên người hoặc nhóm)
    const matchedConversations = conversations.filter((conv) => {
      if (conv.isGroup && conv.groupName) {
        return conv.groupName.toLowerCase().includes(searchValue.toLowerCase());
      }

      // Chat 1-1: tìm người còn lại
      const other = conv.participants.find((m) => m._id.toString() !== userId);
      return other?.username.toLowerCase().includes(searchValue.toLowerCase());
    });

    // 3. Tìm user theo tên (không gồm bản thân)
    const matchedUsers = await User.find({
      _id: { $ne: userId },
      username: { $regex: searchValue, $options: "i" },
    }).select("username avatar");

    // 4. Lọc những user chưa có conversation 1-1 với mình
    const existingUserIds = conversations
      .filter((conv) => !conv.isGroup)
      .map((conv) =>
        conv.participants.find((m) => m._id.toString() !== userId)?._id.toString()
      );

    const newUsers = matchedUsers.filter(
      (u) => !existingUserIds.includes(u._id.toString())
    );

    res.json({
      conversations: matchedConversations,
      newUsers: newUsers,
    });
  } catch (err) {
    console.error("[SearchController Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsersToCreateGroup = async (req, res) => {

  try {
    const userId = req.user.id;
    console.log('userid',userId)
    const {searchValue} = req.body;

    if (!searchValue) {
      return res.status(400).json({ message: "Missing searchValue parameter" });
    }
    // Tìm user chia làm 2 phần. 1 phần là tìm các User đã có conversation 1-1 với mình
    // 2 phần la tìm các User chưa có conversation 1-1 với mình
    // Không tìm các conversation group , chỉ tìm User

    // 1. Lấy các conversation mà user hiện tại tham gia
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants")
      .lean();

    // 2. Lọc các User khớp với searchValue mà có conversation 1-1 với mình (chỉ tìm người)
    const users = conversations
      .filter((conv) => !conv.isGroup)
      .map((conv) =>
        conv.participants.find((m) => m._id.toString() !== userId)
      )
      .filter(Boolean)
      .filter((u) => u.username.toLowerCase().includes(searchValue.toLowerCase()));


    // 3. Tìm user theo tên (không gồm bản thân)
    const matchedUsers = await User.find({
      _id: { $ne: userId },
      username: { $regex: searchValue, $options: "i" },
    })

    // 4. Lọc những user chưa có conversation 1-1 với mình
    const existingUserIds = conversations
      .filter((conv) => !conv.isGroup)
      .map((conv) =>
        conv.participants.find((m) => m._id.toString() !== userId)?._id.toString()
      );

    const newUsers = matchedUsers.filter(
      (u) => !existingUserIds.includes(u._id.toString())
    );

    res.json({
      conversations: users,
      newUsers: newUsers,
    });
  } catch (err) {
    console.error("[SearchController Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
