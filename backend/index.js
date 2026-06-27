import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import planRoutes from "./routes/plan.js";
import plansRoutes from "./routes/plans.js";

const app = express();

app.use(cors());
app.use(express.json());

// 📝 Request-Response Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();

  const sanitizeBody = (body) => {
    if (!body || typeof body !== "object") return body;
    const sanitized = { ...body };
    if (sanitized.password) sanitized.password = "[REDACTED]";
    return sanitized;
  };

  console.log(`[REQUEST] 📥 ${req.method} ${req.originalUrl} | Payload:`, sanitizeBody(req.body));
  console.log(`[AUTH] JWT Header Presence: ${req.header("Authorization") ? "Yes" : "No"}`);

  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    console.log(`[RESPONSE] 📤 ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms | Payload:`, data);
    return originalJson.call(this, data);
  };

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/plans", plansRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  // Mongoose invalid ID cast error (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
