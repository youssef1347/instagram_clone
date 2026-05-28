const generateOtp = require("../utils/generateOtp");
const { generateToken } = require("../utils/generateToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const { registerSchema, loginSchema } = require("../validation/authValidation");



// register function
exports.register = (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ message: error.details.map(error => error.message) });
        }

        const { username, email, password } = value;

        const existUser = await User.find({ email });

        if (existUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User created successfully", email: newUser.email, username: newUser.username });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


// send otp function
exports.sendOtp = async (req, res) => {
    try {
        // get email from request body
        const { email } = req.body;

        // check if the user exists
        const user = await User.find({ email });

        if (!user) {
            return res.status(400).json({ message: "no email detected" });
        }

        // generate otp and otp expiration time
        const { otp, otpExpiration } = generateOtp();

        // save otp and otp expiration time to the user document
        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        // send otp to the user's email
        await sendEmail(
            email,
            "Your OTP Code",
            `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        );

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}


// verify otp function
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the user by email
        const user = await User.find({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Check if the OTP is valid and not expired
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear the OTP and expiration time
        user.otp = undefined;
        user.otpExpiration = undefined;

        // verify the user
        user.isVerified = true;

        // save the user document
        await user.save();

        // generate refresh token and access token
        const { accessToken, refreshToken } = generateToken(user);

        // store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "OTP verified successfully", accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}


// login function
exports.login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ message: error.details.map(error => error.message) });
        }

        const { email, password } = value;

        // Check if the user exists
        const user = await User.find({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }

        // generate refresh token and access token
        const { accessToken, refreshToken } = generateToken(user);

        // store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            email: user.email,
            username: user.username,
            accessToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}


// logout function
exports.logout = (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}


// forgot password function
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.find({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Generate a new reset password token
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update the user document with the new reset password token
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // generate reset password link
        // code to get the frontend url from environment variable will be added later

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}