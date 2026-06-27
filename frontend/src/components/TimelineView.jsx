export default function TimelineView({ schedule, aiPlan }) {
  const formatHours = (hours = 0) => {
    if (typeof hours === "string") return hours;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (!h && !m) return "0 mins";
    return `${h ? `${h} hrs ` : ""}${m ? `${m} mins` : ""}`.trim();
  };

  return (
    <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6">
      {schedule.map((day) => (
        <div key={day.day} className="relative animate-in slide-in-from-left duration-250">
          {/* Timeline node dot */}
          <span
            className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-slate-50 ${
              day.type === "revision" ? "bg-amber-500" : "bg-blue-600"
            }`}
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">Day {day.day}</span>
              <span className="text-xs font-bold text-slate-800">{day.date}</span>
              {day.type === "revision" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                  Revision / Test
                </span>
              )}
            </div>

            {day.type !== "revision" ? (
              <div className="mt-2.5 space-y-2">
                {day.subjects.map((sub) => {
                  const topics = aiPlan?.dailyTopics?.[`Day ${day.day}`]?.[sub.name] || [];
                  
                  return (
                    <div key={sub.name} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="flex items-center justify-between gap-4">
                        <strong className="text-xs font-bold text-slate-800">{sub.name}</strong>
                        <span className="text-[10px] font-bold text-slate-400">⏱️ {formatHours(sub.hours)}</span>
                      </div>
                      
                      {topics.length > 0 && (
                        <ul className="mt-2 space-y-1 pl-3.5 list-disc text-slate-500 text-[10px]">
                          {topics.map((topic, i) => (
                            <li key={i} className="leading-relaxed">{topic}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed">
                Take revision sets, solve tests, or review previous study schedules.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
