import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import EmptyState from "../components/EmptyState";

export default function Analytics({ plans }) {
  if (!plans || plans.length === 0) {
    return (
      <EmptyState
        title="No Analytics Available"
        description="Generate a study plan first to compile statistics, weekly hourly loads, and topic distribution charts."
      />
    );
  }

  // 1. Calculations for Overall Metrics
  const totalPlans = plans.length;
  
  const allSubjects = new Set();
  plans.forEach((p) => p.subjects?.forEach((s) => allSubjects.add(s)));
  const totalSubjectsCount = allSubjects.size;

  const totalPlannedDays = plans.reduce((acc, curr) => acc + (curr.generatedPlan?.daysLeft || 0), 0);

  const totalPlannedHours = plans.reduce((acc, curr) => {
    const days = curr.generatedPlan?.daysLeft || 0;
    const hours = curr.dailyHours || 0;
    return acc + (days * hours);
  }, 0);

  const avgHours = plans.length > 0 
    ? Math.round((plans.reduce((acc, curr) => acc + (curr.dailyHours || 0), 0) / plans.length) * 10) / 10
    : 0;

  // 2. Data for Bar Chart: Daily Study Hours per plan
  const barChartData = plans.slice(-7).map((plan) => ({
    name: plan.title.slice(0, 12) + (plan.title.length > 12 ? "..." : ""),
    hours: plan.dailyHours || 0,
    days: plan.generatedPlan?.daysLeft || 0,
  }));

  // 3. Data for Donut Chart: Subject Allocation loads
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

  const donutColors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

  // 4. Data for Area Chart: Progression of planned hours (Cumulative hours)
  let cumulative = 0;
  const areaChartData = plans.map((plan) => {
    const hours = (plan.generatedPlan?.daysLeft || 0) * (plan.dailyHours || 0);
    cumulative += hours;
    return {
      name: plan.title.slice(0, 10),
      hours: cumulative,
    };
  });

  const tooltipStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "11px",
    color: "#0f172a",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Plans</span>
          <strong className="text-2xl font-black text-slate-800 mt-1 block">{totalPlans}</strong>
          <span className="text-[9px] text-slate-455 mt-1 block">Active roadmaps generated</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syllabus Scope</span>
          <strong className="text-2xl font-black text-blue-600 mt-1 block">{totalSubjectsCount} subjects</strong>
          <span className="text-[9px] text-slate-455 mt-1 block">Unique subjects studies</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Intensity</span>
          <strong className="text-2xl font-black text-slate-800 mt-1 block">{avgHours} hrs</strong>
          <span className="text-[9px] text-slate-455 mt-1 block">Avg daily hours config</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cumulative Hours</span>
          <strong className="text-2xl font-black text-slate-800 mt-1 block">{totalPlannedHours} hrs</strong>
          <span className="text-[9px] text-slate-455 mt-1 block">Total planned study time</span>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Study hours intensity per plan (Bar Chart) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col transition-colors">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800">Study Intensity Distribution</h4>
            <p className="text-[10px] text-slate-400">Daily hours configuration of recent study schedules</p>
          </div>
          
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="hours" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Donut Chart - Subject allocation mapping */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col transition-colors">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800">Subject Focus Allocation</h4>
            <p className="text-[10px] text-slate-400">Distribution frequency of top subjects planned</p>
          </div>

          <div className="h-[220px] flex items-center justify-center">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-400 text-xs italic">Insufficient subject data</span>
            )}
          </div>
        </div>

        {/* Chart 3: Planned Hours progression over time (Area Chart) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col transition-colors">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800">Cumulative Planned Study Hours</h4>
            <p className="text-[10px] text-slate-400">Progression of scheduled hours across all generated roadmaps</p>
          </div>
          
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
