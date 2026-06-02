const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./utils/connectDB");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

// routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// connect to database
connectDB();