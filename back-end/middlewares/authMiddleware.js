const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
    
        const token = authHeader.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "invalid or expired token" });
    }


}

module.exports = { authMiddleware };