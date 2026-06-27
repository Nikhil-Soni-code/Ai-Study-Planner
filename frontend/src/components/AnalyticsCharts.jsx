import { useState } from "react";
import EmptyState from "./EmptyState";

export default function AnalyticsCharts({ plans }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (!plans || plans.length === 0) {
    return (
      <EmptyState
        title="No Analytics Data Available"
        description="Configure and generate your first AI study roadmap to visualize preparation statistics, hours allocation, and subject loads."
      />
    );
  }

  // 1. Calculations for Overall Metrics
  const totalPlans = plans.length;
  
  // Total Unique Subjects
  const allSubjects = new Set();
  plans.forEach((p) => p.subjects?.forEach((s) => allSubjects.add(s)));
  const totalSubjectsCount = allSubjects.size;

  // Total Planned Days
  const totalPlannedDays = plans.reduce((acc, curr) => acc + (curr.generatedPlan?.daysLeft || 0), 0);

  // Total Planned Study Hours
  const totalPlannedHours = plans.reduce((acc, curr) => {
    const days = curr.generatedPlan?.daysLeft || 0;
    const hours = curr.dailyHours || 0;
    // Account for revision days which aren't heavy subjects but still take time
    return acc + (days * hours);
  }, 0);

  // 2. Calculations for Donut Chart (Subject Allocation)
  const subjectFrequency = {};
  plans.forEach((p) => {
    p.subjects?.forEach((s) => {
      subjectFrequency[s] = (subjectFrequency[s] || 0) + 1;
    });
  });
  const subjectData = Object.entries(subjectFrequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 subjects

  const totalSubjectMentions = subjectData.reduce((acc, curr) => acc + curr.value, 0);

  // 3. Calculations for Bar Chart (Weekly/Daily study distribution across plans)
  const last7Plans = [...plans].reverse().slice(-7);
  const barChartData = last7Plans.map((plan, index) => ({
    label: plan.title.slice(0, 10) + (plan.title.length > 10 ? "..." : ""),
    hours: plan.dailyHours || 0,
    days: plan.generatedPlan?.daysLeft || 0,
  }));

  // Render Donut Chart helper values
  let cumulativeAngle = 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Analytics Hero Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Plans</span>
          <strong className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">{totalPlans}</strong>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Active roadmaps</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Syllabus Load</span>
          <strong className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{totalSubjectsCount} subjects</strong>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Unique exam areas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Time Covered</span>
          <strong className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">{totalPlannedDays} days</strong>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Overall planning horizon</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Budgeted Study</span>
          <strong className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">{totalPlannedHours} hrs</strong>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Cumulative hours scheduled</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Study hours per plan (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-150">Study Intensity Distribution</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Daily study hours config across recent roadmaps</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between h-[180px] pt-4 relative border-b border-slate-100 dark:border-slate-800/80 px-2">
            {barChartData.map((d, index) => {
              const maxVal = Math.max(...barChartData.map((b) => b.hours), 8);
              const heightPct = (d.hours / maxVal) * 100;
              
              return (
                <div
                  key={index}
                  className="flex flex-col items-center group w-1/8 relative"
                  onMouseEnter={() => setHoveredBar({ index, ...d })}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Bar */}
                  <div
                    className="w-8 bg-indigo-500/80 hover:bg-indigo-600 dark:bg-indigo-600/70 dark:hover:bg-indigo-500 rounded-t-lg transition-all duration-200 cursor-pointer"
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                  />
                  {/* Label */}
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-2 truncate w-full text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}

            {/* Hover Tooltip */}
            {hoveredBar && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md pointer-events-none z-10 transition-all border border-slate-800">
                <span className="block text-indigo-400">{hoveredBar.label}</span>
                <span>Config: {hoveredBar.hours} hrs/day • {hoveredBar.days} days</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Donut Chart (Subject allocation loads) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-150">Top Subjects Mapping</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Allocation breakdown of major subjects across planners</p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                  className="dark:stroke-slate-800/80"
                />
                
                {subjectData.map((d, index) => {
                  const pct = (d.value / totalSubjectMentions) * 100;
                  const dashArray = `${pct} 100`;
                  const dashOffset = -cumulativeAngle;
                  cumulativeAngle += pct;
                  
                  // Simple color mapping
                  const colors = ["#4f46e5", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                  const color = colors[index % colors.length];

                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="12"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-300 hover:stroke-[14] cursor-pointer"
                      onMouseEnter={() => setHoveredSlice({ index, ...d, pct })}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Centered Total label inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                <strong className="text-base font-black text-slate-700 dark:text-slate-205">{totalSubjectMentions}</strong>
              </div>
            </div>

            {/* Right: Legend */}
            <div className="space-y-2 text-xs flex-1 max-w-[180px]">
              {subjectData.map((d, index) => {
                const colors = ["#4f46e5", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                const color = colors[index % colors.length];
                const percentage = Math.round((d.value / totalSubjectMentions) * 100);

                return (
                  <div key={d.name} className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="truncate max-w-[100px] font-semibold">{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slice Tooltip feedback */}
          {hoveredSlice && (
            <div className="text-center text-[10px] text-slate-500 dark:text-slate-400 mt-4 font-bold border-t border-slate-50 dark:border-slate-800/80 pt-2 animate-pulse">
              {hoveredSlice.name}: <span className="text-indigo-650 dark:text-indigo-400">{Math.round(hoveredSlice.pct)}%</span> of active preparation focus.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
