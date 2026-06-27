import mongoose from "mongoose";

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subjects: {
    type: [String],
    default: []
  },
  weakSubjects: {
    type: [String],
    default: []
  },
  examDate: {
    type: Date,
    required: true
  },
  dailyHours: {
    type: Number,
    required: true
  },
  generatedPlan: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("StudyPlan", studyPlanSchema);
