const otpGenerator = require('otp-generator');

const generateOtp = () => {
    const otp = otpGenerator.generate(6,
        {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            digits: true,
        });

    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    return { otp, otpExpiration };
}

module.exports = generateOtp;