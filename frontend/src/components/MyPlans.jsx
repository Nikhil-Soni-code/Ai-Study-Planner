import PlanCard from "./PlanCard";
import EmptyState from "./EmptyState";

export default function MyPlans({
  plans,
  loading,
  error,
  onDelete,
  onViewPlan,
  onDownloadPDF,
  onCreatePlanClick,
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Saved Study Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage your generated study schedules</p>
        </div>
        <button
          onClick={onCreatePlanClick}
          className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all duration-150 text-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 transition-colors">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Loading plans catalog...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 border border-red-100 dark:border-red-900/40 p-6 rounded-2xl text-center max-w-md mx-auto my-10">
          <p className="font-bold mb-1">Error Loading Plans</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={onCreatePlanClick}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          title="No Saved Plans Found"
          description="You don't have any saved study plans under this account. Generate a schedule and it will automatically be stored here."
          buttonText="Plan Your Studies Now"
          onButtonClick={onCreatePlanClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onView={() => onViewPlan(plan)}
              onDelete={() => onDelete(plan._id)}
              onDownloadPDF={() => onDownloadPDF(plan)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
