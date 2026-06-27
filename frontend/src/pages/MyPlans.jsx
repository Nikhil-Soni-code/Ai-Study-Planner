import { useState } from "react";
import PlanCard from "../components/PlanCard";
import EmptyState from "../components/EmptyState";

export default function MyPlans({
  plans,
  loading,
  error,
  onDeletePlan,
  onViewPlan,
  onDownloadPDF,
  onCreatePlanClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Get all unique subjects for the filter dropdown
  const getUniqueSubjects = () => {
    const subjects = new Set();
    plans.forEach((p) => p.subjects?.forEach((s) => subjects.add(s)));
    return Array.from(subjects).sort();
  };

  const uniqueSubjects = getUniqueSubjects();

  // Apply search, filter, and sort
  const getProcessedPlans = () => {
    let result = [...plans];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Subject filter
    if (subjectFilter !== "all") {
      result = result.filter((p) => p.subjects?.includes(subjectFilter));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "examAsc") {
        return new Date(a.examDate) - new Date(b.examDate);
      }
      if (sortBy === "examDesc") {
        return new Date(b.examDate) - new Date(a.examDate);
      }
      return 0;
    });

    return result;
  };

  const processedPlans = getProcessedPlans();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-850 tracking-tight">Saved Study Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage your generated study schedules</p>
        </div>
        <button
          onClick={onCreatePlanClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all duration-155 text-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Create New Plan
        </button>
      </div>

      {/* Filter and search Bar */}
      <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4 transition-colors">
        
        {/* Search field */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none text-sm">
            🔍
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Search plans by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter by subject */}
          <div className="flex-1 md:flex-initial min-w-[130px]">
            <select
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Sort by */}
          <div className="flex-1 md:flex-initial min-w-[130px]">
            <select
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="examAsc">Exam: Closest</option>
              <option value="examDesc">Exam: Farthest</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid plans */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl p-8 transition-colors">
          <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-slate-400">Loading catalog...</span>
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          title="No Study Plans Found"
          description="Create your first study roadmap to schedule exam revisions and track deadlines."
          buttonText="Generate Plan"
          onButtonClick={onCreatePlanClick}
        />
      ) : processedPlans.length === 0 ? (
        <EmptyState
          title="No Search Results"
          description="No saved plans match your current search queries or subject filter criteria."
          buttonText="Reset Filters"
          onButtonClick={() => {
            setSearchQuery("");
            setSubjectFilter("all");
            setSortBy("newest");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedPlans.map((plan) => (
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
  );
}
