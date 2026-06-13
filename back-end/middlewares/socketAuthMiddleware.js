const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { socketAuthMiddleware };
