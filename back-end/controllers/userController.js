const User = require("../models/users");


exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(' username email profilePic bio privateAccount ');

        res.json({message: "User data retrieved successfully", user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

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
}