import { useState } from "react";

export default function PlannerForm({ onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [subjects, setSubjects] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(4);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Plan name is required";
    if (!subjects.trim()) errors.subjects = "At least one subject is required";
    if (!examDate) errors.examDate = "Target exam date is required";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(examDate);
    if (examDate && selectedDate <= today) {
      errors.examDate = "Exam date must be in the future";
    }

    if (dailyHours < 1 || dailyHours > 16) {
      errors.dailyHours = "Study intensity must be between 1 and 16 hours";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({
      title,
      subjects,
      weakSubjects,
      examDate,
      dailyHours,
    });
  };

  // Compute form completion percentage for visual indicator
  const getCompletionPercentage = () => {
    let filled = 0;
    if (title.trim()) filled++;
    if (subjects.trim()) filled++;
    if (examDate) filled++;
    return Math.round((filled / 3) * 100);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
      
      {/* Form Title & Progress */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
            Planner Settings
          </h2>
          <p className="text-[10px] text-slate-455 mt-0.5">
            Configure subjects, weak areas, target dates, and loads
          </p>
        </div>
        
        {/* Progress Rate Ring */}
        <div className="text-right">
          <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Completion</span>
          <span className="text-xs font-bold text-blue-600">
            {getCompletionPercentage()}%
          </span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Plan Title */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Plan Name / Title
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-805 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
              fieldErrors.title ? "border-red-400 focus:ring-red-500/10" : "border-slate-200 focus:border-blue-500"
            }`}
            placeholder="e.g. Finals Preparation, MCAT Routine"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: "" });
            }}
          />
          {fieldErrors.title && (
            <span className="text-[10px] text-red-500 font-medium mt-1 block">
              {fieldErrors.title}
            </span>
          )}
        </div>

        {/* Subjects Input */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Subjects (Comma Separated)
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-805 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
              fieldErrors.subjects ? "border-red-400 focus:ring-red-500/10" : "border-slate-200 focus:border-blue-500"
            }`}
            placeholder="e.g. Physics, Calculus, Organic Chemistry"
            value={subjects}
            onChange={(e) => {
              setSubjects(e.target.value);
              if (fieldErrors.subjects) setFieldErrors({ ...fieldErrors, subjects: "" });
            }}
          />
          {fieldErrors.subjects && (
            <span className="text-[10px] text-red-500 font-medium mt-1 block">
              {fieldErrors.subjects}
            </span>
          )}
        </div>

        {/* Weak Subjects Input */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Weak Areas / Hard Subjects (Comma Separated)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-805 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="e.g. Organic Chemistry (adds more study blocks)"
            value={weakSubjects}
            onChange={(e) => setWeakSubjects(e.target.value)}
          />
          <span className="text-[9px] text-slate-400 mt-1 block leading-relaxed">
            Gemini prioritizes these items by scheduling additional revision days and longer sessions.
          </span>
        </div>

        {/* Exam Target Date */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Target Exam Date
          </label>
          <input
            type="date"
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-805 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
              fieldErrors.examDate ? "border-red-400 focus:ring-red-500/10" : "border-slate-200 focus:border-blue-500"
            }`}
            value={examDate}
            onChange={(e) => {
              setExamDate(e.target.value);
              if (fieldErrors.examDate) setFieldErrors({ ...fieldErrors, examDate: "" });
            }}
          />
          {fieldErrors.examDate && (
            <span className="text-[10px] text-red-500 font-medium mt-1 block">
              {fieldErrors.examDate}
            </span>
          )}
        </div>

        {/* Daily Study Hours Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Study Intensity (Hours / Day)
            </label>
            <span className="text-xs font-bold text-blue-600">{dailyHours} hours</span>
          </div>
          <input
            type="range"
            min="1"
            max="16"
            step="1"
            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
          />
          {fieldErrors.dailyHours && (
            <span className="text-[10px] text-red-500 font-medium mt-1 block">
              {fieldErrors.dailyHours}
            </span>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 transition-all duration-150 cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "Generate Routine"
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
