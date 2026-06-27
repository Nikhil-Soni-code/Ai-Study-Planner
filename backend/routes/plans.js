import express from "express";
import StudyPlan from "../models/StudyPlan.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// GET /api/plans - Get all plans belonging to logged-in user
router.get("/", auth, async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
});

// GET /api/plans/:id - Get a specific plan, ensuring ownership
router.get("/:id", auth, async (req, res, next) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, error: "Study plan not found" });
    }
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to view this plan" });
    }
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/plans/:id - Delete a specific plan, ensuring ownership
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, error: "Study plan not found" });
    }
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this plan" });
    }
    await StudyPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Study plan deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
