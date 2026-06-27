import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import planRoutes from "./routes/plan.js";
import plansRoutes from "./routes/plans.js";

const app = express();

/* ===========================
   CORS Configuration
=========================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ai-study-planner-silk.vercel.app"
    ],
    credentials: true
  })
);

/* ===========================
   Middleware
=========================== */
app.use(express.json());

/* ===========================
   Health Check Route
=========================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Study Planner API Running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ===========================
   Request / Response Logger
=========================== */
app.use((req, res, next) => {
  const start = Date.now();

  const sanitizeBody = (body) => {
    if (!body || typeof body !== "object") return body;

    const sanitized = { ...body };

    if (sanitized.password) {
      sanitized.password = "[REDACTED]";
    }

    return sanitized;
  };

  console.log(
    `[REQUEST] 📥 ${req.method} ${req.originalUrl} | Payload:`,
    sanitizeBody(req.body)
  );

  console.log(
    `[AUTH] JWT Header Presence: ${
      req.header("Authorization") ? "Yes" : "No"
    }`
  );

  const originalJson = res.json;

  res.json = function (data) {
    const duration = Date.now() - start;

    console.log(
      `[RESPONSE] 📤 ${req.method} ${req.originalUrl} | Status: ${
        res.statusCode
      } | Duration: ${duration}ms`
    );

    return originalJson.call(this, data);
  };

  next();
});

/* ===========================
   API Routes
=========================== */
app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/plans", plansRoutes);

/* ===========================
   404 Handler
=========================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

/* ===========================
   Global Error Handler
=========================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

/* ===========================
   MongoDB Connection
=========================== */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Mongo Error:", err.message);
    process.exit(1);
  }
};

connectDB();