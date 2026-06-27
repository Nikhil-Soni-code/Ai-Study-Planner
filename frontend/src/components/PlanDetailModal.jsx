import { useState } from "react";
import TimelineView from "./TimelineView";
import CalendarView from "./CalendarView";

function Section({ title, content, icon }) {
  if (!content) return null;
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm my-3">
      <div className="flex items-center gap-2 mb-2.5 border-b border-slate-100 pb-2">
        <span className="text-blue-600 p-1.5 bg-blue-50 rounded-lg">{icon}</span>
        <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-slate-650 text-xs whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
}

export default function PlanDetailModal({ plan, onClose }) {
  const [resultViewMode, setResultViewMode] = useState("timeline");
  const result = plan.generatedPlan;

  if (!result) return null;

  const getSubjectsCount = () => Object.keys(result?.perDayHours || {}).length;
  const getRevisionDaysCount = () => result?.schedule?.filter((day) => day.type === "revision").length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-200">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Saved roadmap</span>
            <h2 className="text-sm font-extrabold text-slate-800 mt-0.5 truncate max-w-md">{plan.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Subjects</span>
              <strong className="text-lg font-black text-blue-605 mt-0.5">{getSubjectsCount()}</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Planned horizon</span>
              <strong className="text-lg font-black text-slate-800 mt-0.5">{result.daysLeft} days</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Config</span>
              <strong className="text-lg font-black text-slate-800 mt-0.5">{result.dailyTime}</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Revision Days</span>
              <strong className="text-lg font-black text-amber-600 mt-0.5">{getRevisionDaysCount()}</strong>
            </div>
          </div>

          {/* Schedule switcher and text details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4 gap-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                    📅 Schedule View
                  </h3>
                  
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setResultViewMode("timeline")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                        resultViewMode === "timeline"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-455 hover:text-slate-700"
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setResultViewMode("calendar")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                        resultViewMode === "calendar"
                          ? "bg-white text-slate-800 shadow-sm"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
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
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition-all duration-150 cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
