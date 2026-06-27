import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout({ view, setView, children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 transition-colors duration-150 selection:bg-blue-100 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px]">
      
      {/* Navbar */}
      <Navbar user={user} onLogout={logout} onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar view={view} setView={setView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
