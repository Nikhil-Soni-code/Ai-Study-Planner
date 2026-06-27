export default function Navbar({ user, onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger icon trigger */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg focus:outline-none cursor-pointer"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-605 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-900">AI Study Planner</span>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-455 mt-0.5">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-slate-50 hover:bg-slate-100 text-slate-655 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
