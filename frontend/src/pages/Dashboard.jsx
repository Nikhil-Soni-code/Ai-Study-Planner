import PlanCard from "../components/PlanCard";

export default function Dashboard({ plans, setView, onViewPlan, onDeletePlan, onDownloadPDF }) {
  const getDashboardStats = () => {
    const subjects = new Set();
    plans.forEach((p) => p.subjects?.forEach((s) => subjects.add(s)));
    
    const totalPlannedDays = plans.reduce((acc, curr) => acc + (curr.generatedPlan?.daysLeft || 0), 0);
    const avgDailyHours = plans.length > 0
      ? Math.round((plans.reduce((acc, curr) => acc + (curr.dailyHours || 0), 0) / plans.length) * 10) / 10
      : 0;

    const totalRevisionDays = plans.reduce((acc, curr) => {
      const revs = curr.generatedPlan?.schedule?.filter(day => day.type === "revision").length || 0;
      return acc + revs;
    }, 0);

    // Calculate nearest exam countdown
    let countdown = "N/A";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futurePlans = plans
      .map(p => new Date(p.examDate))
      .filter(d => d > today)
      .sort((a, b) => a - b);

    if (futurePlans.length > 0) {
      const diffMs = futurePlans[0] - today;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      countdown = `${diffDays} days`;
    }

    return {
      subjectsCount: subjects.size,
      plannedDays: totalPlannedDays,
      dailyHours: avgDailyHours,
      revisionDays: totalRevisionDays,
      plansCount: plans.length,
      countdown
    };
  };

  const stats = getDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome banner */}
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm relative overflow-hidden transition-colors">
        <div className="max-w-xl relative z-10">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50">
            SaaS study roadmaps
          </span>
          <h1 className="text-3xl font-extrabold text-slate-905 tracking-tight mt-4">
            AI-Powered Study Planning
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Customize subjects, mark weak areas, and generate granular learning timelines backed by Google Gemini.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setView("planner")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              Generate New Plan
            </button>
            <button
              onClick={() => setView("my-plans")}
              className="bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm hover:bg-slate-200 transition-all cursor-pointer"
            >
              View Saved Plans
            </button>
          </div>
        </div>
        
        {/* Decorative backdrop */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* Metrics Dash Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Syllabus Scope</span>
          <strong className="text-xl font-black text-slate-800 mt-1 block">{stats.subjectsCount}</strong>
          <span className="text-[9px] text-slate-455 mt-0.5 block">Unique Subjects</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Exam</span>
          <strong className="text-xl font-black text-blue-600 mt-1 block">{stats.countdown}</strong>
          <span className="text-[9px] text-slate-455 mt-0.5 block">Countdown</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Intensity</span>
          <strong className="text-xl font-black text-slate-800 mt-1 block">{stats.dailyHours} hrs</strong>
          <span className="text-[9px] text-slate-455 mt-0.5 block">Daily average</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Saved roadmaps</span>
          <strong className="text-xl font-black text-slate-800 mt-1 block">{stats.plansCount}</strong>
          <span className="text-[9px] text-slate-455 mt-0.5 block">Total Saved</span>
        </div>
      </div>

      {/* Recent Plans */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-850 uppercase tracking-widest">Recent Study Plans</h3>
          {plans.length > 3 && (
            <button
              onClick={() => setView("my-plans")}
              className="text-xs font-bold text-blue-605 hover:text-blue-700 hover:underline cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 transition-colors">
            <p className="text-xs text-slate-550 mb-4">You haven't generated any study roadmaps yet.</p>
            <button
              onClick={() => setView("planner")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
            >
              Generate First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.slice(0, 3).map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onView={() => onViewPlan(plan)}
                onDelete={() => onDeletePlan(plan._id)}
                onDownloadPDF={() => onDownloadPDF(plan)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
