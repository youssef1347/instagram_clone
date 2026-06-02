const express = require('express');
const {
    register,
    login,
    verifyOtp,
    sendOtp,
    logout } = require('../controllers/authController');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);
router.post('/logout', logout);
router.get("/test", (req, res) => {
  res.send("working");
});

module.exports = router;