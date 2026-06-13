const User = require("../models/users");
const Notification = require("../models/notifications");
const { emitNotification } = require("../utils/socket");

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      " username email profilePic bio privateAccount followers following ",
    );

    res.json({ message: "User data retrieved successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username profilePic bio privateAccount followers following",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User retrieved successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const searchRegex = new RegExp(query.trim(), "i");
    const users = await User.find({
      _id: { $ne: req.user.id },
      username: { $regex: searchRegex },
    }).select("username profilePic bio");

    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { userId } = req.params;

    if (currentUserId === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId).select(
        "-password -otp -otpExpiration -resetPasswordToken -resetPasswordExpires",
      ),
      User.findById(userId).select(
        "-password -otp -otpExpiration -resetPasswordToken -resetPasswordExpires",
      ),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = currentUser.following.some((id) =>
      id.equals(userId),
    );

    if (alreadyFollowing) {
      return res.status(409).json({ message: "Already following this user" });
    }

    currentUser.following.push(userId);
    targetUser.followers.push(currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    const notification = await Notification.create({
      recipient: targetUser._id,
      actor: currentUser._id,
      type: "follow",
      message: `${currentUser.username} started following you`,
    });

    await notification.populate("actor", "username profilePic");
    emitNotification(targetUser._id, notification);

    res.json({
      message: "User followed successfully",
      user: targetUser,
      currentUser,
      isFollowing: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { userId } = req.params;

    if (currentUserId === userId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId).select(
        "-password -otp -otpExpiration -resetPasswordToken -resetPasswordExpires",
      ),
      User.findById(userId).select(
        "-password -otp -otpExpiration -resetPasswordToken -resetPasswordExpires",
      ),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userId),
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => !id.equals(currentUserId),
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      message: "User unfollowed successfully",
      user: targetUser,
      currentUser,
      isFollowing: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.test = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "Test successful", user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
