import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* REGISTER */
router.post("/signup", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Please provide name, email and password" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, error: "Email already in use" });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        next(err); // Pass to global error handler
    }
});

/* LOGIN */
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        next(err); // Pass to global error handler
    }
});

export default router;
