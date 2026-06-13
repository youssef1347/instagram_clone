const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./utils/connectDB");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cookieParser = require("cookie-parser");
const { initSocket } = require("./utils/socket");
dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 3000;

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 404 Error Handler - Must be last
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found",
    method: req.method,
    path: req.path,
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// connect to database
connectDB();
