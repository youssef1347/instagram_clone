const express = require('express');
const {
    register,
    login,
    verifyOtp,
    sendOtp,
    logout, 
    forgotPassword,
    resetPassword,
    refreshToken} = require('../controllers/authController');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.get("/test", (req, res) => {
  res.send("working");
});

module.exports = router;