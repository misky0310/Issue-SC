import "express-async-errors";
import helmet from "helmet";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/auth.route.js";
import issueRoutes from "./routes/issue.route.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.get("/", (req, res) => {
    res.send("Issue Tracking System API is running");
});

const PORT = process.env.PORT || 8000;
mongoose
.connect(process.env.MONGO_URI, {
    autoIndex: true,
})
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});