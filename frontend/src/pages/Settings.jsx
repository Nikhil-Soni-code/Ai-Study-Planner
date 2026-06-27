export default function Settings({ user }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Account Info card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-colors duration-150">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
          Account Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Student Name
            </label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 select-none cursor-not-allowed"
              value={user?.name || "User"}
              disabled
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 select-none cursor-not-allowed"
              value={user?.email || "User email"}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Study Preferences card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-colors duration-150">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
          Study Preferences
        </h2>
        
        <div className="space-y-4 text-xs text-slate-500">
          <div className="flex items-center justify-between gap-4">
            <div>
              <strong className="block font-bold text-slate-700">Default Study Timezone</strong>
              <span>All calendar entries sync with local system parameters.</span>
            </div>
            <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-700">
              System Local Time
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
            <div>
              <strong className="block font-bold text-slate-700">Data Synchronization</strong>
              <span>Saves plans automatically to Mongoose MongoDB collection.</span>
            </div>
            <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-green-100">
              Synchronized
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
