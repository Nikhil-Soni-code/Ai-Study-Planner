import express from "express";
import { generateStudyPlan } from "../ai/gemini.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/**
 * Convert minutes → "X hrs Y min"
 */
function formatMinutes(totalMinutes) {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs} hrs ${mins} min`;
}

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      subjects,
      weakSubjects = [],
      examDate,
      dailyHours,
    } = req.body;

    const filteredSubjects = (subjects || []).map(s => s.trim()).filter(Boolean);
    if (!filteredSubjects.length)
      return res.status(400).json({ success: false, error: "At least one valid subject is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exam = new Date(examDate);

    if (isNaN(exam.getTime())) {
      return res.status(400).json({ success: false, error: "Invalid exam date" });
    }

    if (exam <= today) {
      return res.status(400).json({ success: false, error: "Exam date must be in the future" });
    }

    const daysLeft = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    /* ---------------- WEIGHT CALCULATION ---------------- */
    let totalWeight = 0;
    const weights = {};
    filteredSubjects.forEach((s) => {
      weights[s] = weakSubjects.includes(s) ? 2 : 1;
      totalWeight += weights[s];
    });

    /* ---------------- DAILY MINUTES ---------------- */
    const DAILY_MINUTES = Math.round(dailyHours * 60);
    const perDayMinutes = {};
    filteredSubjects.forEach((s) => {
      perDayMinutes[s] = Math.round((weights[s] / totalWeight) * DAILY_MINUTES);
    });

    /* ---------------- DAY-WISE SCHEDULE ---------------- */
    const schedule = [];
    for (let i = 1; i <= daysLeft; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i - 1);

      if (i % 7 === 0) {
        schedule.push({
          day: i,
          date: date.toISOString().split("T")[0],
          type: "revision",
          plan: "Revision + mock test + weak area analysis",
          totalTime: formatMinutes(DAILY_MINUTES),
        });
        continue;
      }

      schedule.push({
        day: i,
        date: date.toISOString().split("T")[0],
        type: "study",
        subjects: filteredSubjects.map((sub) => ({
          name: sub,
          minutes: perDayMinutes[sub],
          hours: formatMinutes(perDayMinutes[sub]),
        })),
      });
    }

    /* ---------------- AI PROMPT ---------------- */
    const prompt = `
Provide a comprehensive, exam-focused study plan for a student.
Subjects: ${filteredSubjects.join(", ")}
Weak areas: ${weakSubjects.join(", ") || "None specified"}
Days available: ${daysLeft}
Daily study: ${dailyHours} hours

Return STRICT JSON only:
{
  "overview": "vibrant overview",
  "dailyTopics": { "Day 1": { "${filteredSubjects[0]}": ["Topics"] } },
  "importantTopics": "List",
  "revisionStrategy": "Plan",
  "motivation": "Slogan"
}`;

    let aiResponse = await generateStudyPlan(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ success: false, error: "AI failed to generate a valid plan" });
    }

    let aiPlan;
    try {
      aiPlan = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(500).json({ success: false, error: "AI returned invalid JSON" });
    }

    /* ---------------- FINAL RESPONSE ---------------- */
    res.json({
      success: true,
      daysLeft,
      dailyTime: formatMinutes(DAILY_MINUTES),
      perDayHours: Object.fromEntries(
        filteredSubjects.map((s) => [s, formatMinutes(perDayMinutes[s])])
      ),
      schedule,
      aiPlan,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
//plan.js
