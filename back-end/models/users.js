const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    otp: { type: String, maxlength: 6 },
    otpExpiration: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profilePic: { type: String, default: `uploads/default-profile-pic.jpg` },
    bio: { type: String, default: '' },
    privateAccount: { type: Boolean, default: false },
}, { timestamps: true } );

const User = mongoose.model('User', userSchema);

module.exports = User;