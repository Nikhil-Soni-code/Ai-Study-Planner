export default function PlanCard({ plan, onView, onDelete, onDownloadPDF }) {
  const formatExamDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getSubjectsCount = () => plan.subjects?.length || 0;

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between h-[180px] animate-in fade-in duration-200">
      
      {/* Title & Info */}
      <div>
        <div className="flex justify-between items-start gap-3">
          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 flex-1 leading-snug">{plan.title}</h4>
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-blue-100/50">
            {getSubjectsCount()} {getSubjectsCount() === 1 ? 'Subject' : 'Subjects'}
          </span>
        </div>
        
        <p className="text-[10px] text-slate-400 mt-1 truncate">
          Subjects: {plan.subjects?.join(", ")}
        </p>
      </div>

      {/* Target parameters */}
      <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between gap-4 text-[10px] text-slate-455">
        <div>
          <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Target Exam</span>
          <span className="font-bold text-slate-700">{formatExamDate(plan.examDate)}</span>
        </div>
        <div className="text-right">
          <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Daily intensity</span>
          <span className="font-bold text-slate-755">{plan.dailyHours} hrs/day</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center gap-2">
        <button
          onClick={onView}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View Roadmap
        </button>

        <div className="flex items-center gap-2">
          {/* Download PDF button */}
          <button
            onClick={onDownloadPDF}
            className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-50 cursor-pointer"
            title="Download PDF"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          
          {/* Delete plan button */}
          <button
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 cursor-pointer"
            title="Delete Plan"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
