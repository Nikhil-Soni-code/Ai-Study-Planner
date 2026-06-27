import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PlannerForm from "../components/PlannerForm";
import LoadingScreen from "../components/LoadingScreen";
import TimelineView from "../components/TimelineView";
import CalendarView from "../components/CalendarView";
import { generatePlanService } from "../services/planService";

function Section({ title, content, icon }) {
  if (!content) return null;
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm my-4 transition-colors">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
        <span className="text-blue-600 p-1.5 bg-blue-50 rounded-lg">{icon}</span>
        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-slate-600 text-xs whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
}

function formatHours(hours = 0) {
  if (typeof hours === "string") return hours;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (!h && !m) return "0 mins";
  return `${h ? `${h} hrs ` : ""}${m ? `${m} mins` : ""}`.trim();
}

export default function Planner({ setView, onPlanGenerated }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [resultViewMode, setResultViewMode] = useState("timeline");

  const handleGeneratePlan = async (formData) => {
    setLoading(true);
    setError("");
    setPlanTitle(formData.title || `${formData.subjects.split(",")[0].trim()} Study Plan`);

    try {
      const data = await generatePlanService({
        title: formData.title.trim() || `${formData.subjects.split(",")[0].trim()} Study Plan`,
        subjects: formData.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        weakSubjects: formData.weakSubjects.split(",").map((s) => s.trim()).filter(Boolean),
        examDate: formData.examDate,
        dailyHours: Number(formData.dailyHours),
      });

      setResult(data);
      if (onPlanGenerated) {
        onPlanGenerated(); // Refresh App-level plans list
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    let y = 12;

    doc.setFontSize(16);
    doc.text(planTitle, 105, y, { align: "center" });
    y += 10;

    autoTable(doc, {
      startY: y,
      head: [["Subject", "Time / Day"]],
      body: Object.entries(result.perDayHours || {}).map(([s, h]) => [
        s,
        formatHours(h),
      ]),
    });

    y = doc.lastAutoTable.finalY + 8;
    doc.text("Day-wise Schedule", 10, y);
    y += 6;

    result.schedule.forEach((day) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }

      doc.text(
        `Day ${day.day} - ${day.date}${day.type === "revision" ? " (Revision/Test)" : ""}`,
        10,
        y
      );
      y += 5;

      if (day.type !== "revision") {
        day.subjects.forEach((sub) => {
          doc.text(
            `• ${sub.name}: ${formatHours(sub.hours)}`,
            12,
            y
          );
          y += 4;

          const topics =
            result.aiPlan?.dailyTopics?.[`Day ${day.day}`]?.[sub.name] || [];

          topics.forEach((t) => {
            doc.text(`   - ${t}`, 16, y);
            y += 4;
          });
        });
      }

      y += 4;
    });

    doc.save(`${planTitle.replace(/\s+/g, "_")}_Plan.pdf`);
  };

  const getSubjectsCount = () => Object.keys(result?.perDayHours || {}).length;
  const getRevisionDaysCount = () => result?.schedule?.filter((day) => day.type === "revision").length || 0;

  return (
    <div className="space-y-6">
      {loading && <LoadingScreen />}

      {!loading && !result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <PlannerForm onSubmit={handleGeneratePlan} loading={loading} />
            {error && (
              <div className="bg-red-50 text-red-650 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-100 mt-4">
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center h-[525px] transition-colors">
            <span className="inline-flex items-center justify-center p-6 bg-slate-50 rounded-full text-blue-600 mb-5 border border-dashed border-slate-200">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            <h3 className="text-base font-bold text-slate-800">AI-Powered Generation</h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto mt-2 leading-relaxed">
              Define your timeline configurations on the left to let Gemini compile week-wise routines, countdowns, and topic sets.
            </p>
          </div>
        </div>
      )}

      {!loading && result && (
        <div className="space-y-6">
          {/* Top action banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm gap-4 transition-colors">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Saas generated Roadmap</span>
              <h2 className="text-lg font-bold text-slate-800 mt-0.5 truncate max-w-md">
                {planTitle}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100/50 rounded-full text-[10px] font-bold mr-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Auto-saved
              </span>

              <button
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-transparent"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm flex flex-col justify-center transition-colors">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Subjects</span>
              <strong className="text-xl font-black text-blue-605 mt-1">{getSubjectsCount()}</strong>
            </div>

            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm flex flex-col justify-center transition-colors">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Planned horizon</span>
              <strong className="text-xl font-black text-slate-805 mt-1">{result.daysLeft} days</strong>
            </div>

            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm flex flex-col justify-center transition-colors">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Config</span>
              <strong className="text-xl font-black text-slate-805 mt-1">{result.dailyTime}</strong>
            </div>

            <div className="bg-white border border-slate-201 p-4.5 rounded-2xl shadow-sm flex flex-col justify-center transition-colors">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Revision Days</span>
              <strong className="text-xl font-black text-amber-600 mt-1">{getRevisionDaysCount()}</strong>
            </div>
          </div>

          {/* Timelines and calendar displays */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-colors">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4 gap-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                    📅 Schedule View
                  </h3>
                  
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setResultViewMode("timeline")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                        resultViewMode === "timeline"
                          ? "bg-white text-slate-850 shadow-sm"
                          : "text-slate-455 hover:text-slate-700"
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setResultViewMode("calendar")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                        resultViewMode === "calendar"
                          ? "bg-white text-slate-850 shadow-sm"
                          : "text-slate-455 hover:text-slate-700"
                      }`}
                    >
                      Calendar
                    </button>
                  </div>
                </div>

                {resultViewMode === "timeline" ? (
                  <TimelineView schedule={result.schedule} aiPlan={result.aiPlan} />
                ) : (
                  <CalendarView schedule={result.schedule} aiPlan={result.aiPlan} />
                )}
              </div>
            </div>

            {/* Strategic Details */}
            <div className="lg:col-span-5 space-y-4">
              <Section 
                title="Overview & Strategy" 
                content={result.aiPlan?.overview}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <Section 
                title="High-Priority Topics" 
                content={result.aiPlan?.importantTopics}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
              />
              
              <Section 
                title="Revision Strategy" 
                content={result.aiPlan?.revisionStrategy}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                  </svg>
                }
              />
              
              <Section 
                title="Motivation" 
                content={result.aiPlan?.motivation}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => {
                    setResult(null);
                  }}
                  className="flex-1 border border-blue-600 text-blue-600 p-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all cursor-pointer text-center"
                >
                  Create Another Plan
                </button>
                <button
                  onClick={() => setView("my-plans")}
                  className="flex-1 border border-slate-200 text-slate-600 p-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer text-center"
                >
                  View Saved Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
