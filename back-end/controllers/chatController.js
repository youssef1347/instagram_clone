const Conversation = require("../models/conversations");
const Message = require("../models/messages");
const User = require("../models/users");
const { emitMessageToUser } = require("../utils/socket");

// const getCurrentUserId = (req) => req.user.id || req.user._id;

// Keep conversation responses consistent wherever they are returned.
const populateConversation = async (conversation) => {
  return conversation.populate([
    { path: "participants", select: "username profilePic" },
    { path: "lastMessage.sender", select: "username profilePic" },
  ]);
};

// Return every conversation the logged-in user belongs to, newest activity first.
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "username profilePic")
      .populate("lastMessage.sender", "username profilePic")
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrCreateConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    // Direct messages are only between two different users.
    if (currentUserId === userId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    const targetUser = await User.findById(userId).select("username profilePic");

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reuse an existing DM when possible so users do not create duplicate threads.
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
      });
    }

    await populateConversation(conversation);

    res.json({ conversation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;

    // Make sure the requester is a participant before exposing messages.
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "username profilePic")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    // A user can only send messages inside conversations they participate in.
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Store the sender as having read their own outgoing message.
    let message = await Message.create({
      conversation: conversation._id,
      sender: currentUserId,
      text: text.trim(),
      readBy: [currentUserId],
    });

    // Denormalize the latest message onto the conversation for fast inbox lists.
    conversation.lastMessage = {
      text: message.text,
      sender: currentUserId,
      createdAt: message.createdAt,
    };
    await conversation.save();

    message = await message.populate("sender", "username profilePic");
    await populateConversation(conversation);

    // Push the message to every other participant in real time.
    conversation.participants.forEach((participant) => {
      if (participant._id.toString() !== currentUserId) {
        emitMessageToUser(participant._id, {
          conversation,
          message,
        });
      }
    });

    res.status(201).json({ conversation, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;

    // Only participants can mark a conversation as read.
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await Message.updateMany(
      { conversation: conversationId, readBy: { $ne: currentUserId } },
      { $addToSet: { readBy: currentUserId } },
    );

    res.json({ message: "Conversation marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
