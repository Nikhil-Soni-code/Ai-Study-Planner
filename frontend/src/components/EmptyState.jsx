export default function EmptyState({ title, description, buttonText, onButtonClick }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto py-16 transition-colors shadow-sm animate-in fade-in duration-200">
      <span className="inline-flex items-center justify-center p-4 bg-slate-50 text-blue-600 rounded-2xl mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </span>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
      <p className="text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">{description}</p>
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
