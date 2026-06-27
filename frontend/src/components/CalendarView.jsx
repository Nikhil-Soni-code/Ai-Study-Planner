import { useState } from "react";

export default function CalendarView({ schedule, aiPlan }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatHours = (hours = 0) => {
    if (typeof hours === "string") return hours;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (!h && !m) return "0 mins";
    return `${h ? `${h} hrs ` : ""}${m ? `${m} mins` : ""}`.trim();
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 border-b border-slate-100 pb-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}

        {schedule.map((day) => {
          const isSelected = selectedDay?.day === day.day;
          
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day)}
              className={`flex flex-col items-center justify-between p-2.5 min-h-[72px] border rounded-xl text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100"
                  : "bg-slate-50 border-slate-100 hover:bg-slate-100/70 text-slate-800"
              }`}
            >
              <span className={`text-[9px] font-bold ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                Day {day.day}
              </span>
              
              <div className="my-1.5 text-center">
                {day.type === "revision" ? (
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-amber-500"}`} />
                ) : (
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-blue-500"}`} />
                )}
              </div>

              <span className={`text-[8px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-50" : "text-slate-500"}`}>
                {day.type === "revision" ? "Revise" : "Study"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Panel Details */}
      {selectedDay && (
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <span className="text-[10px] font-bold text-slate-400">Day {selectedDay.day} Details</span>
            <span className="text-xs font-bold text-slate-800">({selectedDay.date})</span>
            {selectedDay.type === "revision" && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                Revision / Test
              </span>
            )}
          </div>

          {selectedDay.type !== "revision" ? (
            <div className="space-y-3">
              {selectedDay.subjects.map((sub) => {
                const topics = aiPlan?.dailyTopics?.[`Day ${selectedDay.day}`]?.[sub.name] || [];
                
                return (
                  <div key={sub.name} className="bg-white border border-slate-200/60 p-4 rounded-xl">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 mb-2">
                      <strong className="text-xs font-bold text-slate-850">{sub.name}</strong>
                      <span className="text-[10px] font-bold text-slate-400">⏱️ {formatHours(sub.hours)}</span>
                    </div>

                    {topics.length > 0 ? (
                      <ul className="space-y-1 pl-3.5 list-disc text-slate-550 text-[10px] leading-relaxed">
                        {topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No specific sub-topics flagged for today.</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic leading-relaxed">
              Revision block. Focus on weak subjects, solve practice test modules, and review previous lecture notes.
            </p>
          )}
        </div>
      )}

    </div>
  );
}
