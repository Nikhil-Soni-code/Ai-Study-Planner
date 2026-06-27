import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import MyPlans from "./pages/MyPlans";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import PlanDetailModal from "./components/PlanDetailModal";

import { fetchPlansService, deletePlanService } from "./services/planService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MainApp() {
  const { isAuthenticated, user, token, loading: authLoading } = useAuth();
  
  const [view, setView] = useState("dashboard"); // dashboard, planner, my-plans, analytics, settings
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState("");
  
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);

  // Fetch plans catalog from plans service
  const fetchPlans = async () => {
    if (!token) return;
    setPlansLoading(true);
    setPlansError("");
    try {
      const data = await fetchPlansService();
      setPlans(data.plans || []);
    } catch (err) {
      setPlansError(err.message);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlans();
    } else {
      setPlans([]);
      setView("dashboard");
    }
  }, [isAuthenticated, token]);

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study plan?")) {
      return;
    }
    try {
      await deletePlanService(id);
      setPlans(plans.filter((p) => p._id !== id));
      if (selectedPlanForModal?._id === id) {
        setSelectedPlanForModal(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // PDF Export logic
  const downloadPlanPDF = (plan) => {
    const result = plan.generatedPlan;
    if (!result) return;

    const doc = new jsPDF();
    let y = 12;

    doc.setFontSize(16);
    doc.text(plan.title || "Personalized Study Plan", 105, y, { align: "center" });
    y += 10;

    const formatHours = (hours = 0) => {
      if (typeof hours === "string") return hours;
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      if (!h && !m) return "0 mins";
      return `${h ? `${h} hrs ` : ""}${m ? `${m} mins` : ""}`.trim();
    };

    autoTable(doc, {
      startY: y,
      head: [["Subject", "Time / Day"]],
      body: Object.entries(result.perDayHours || {}).map(([s, h]) => [
        s,
        formatHours(h),
      ]),
    });

    y = doc.lastAutoTable.finalY + 8;
    doc.text("Day-wise Schedule", 10, y);
    y += 6;

    result.schedule.forEach((day) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }

      doc.text(
        `Day ${day.day} - ${day.date}${day.type === "revision" ? " (Revision/Test)" : ""}`,
        10,
        y
      );
      y += 5;

      if (day.type !== "revision") {
        day.subjects.forEach((sub) => {
          doc.text(
            `• ${sub.name}: ${formatHours(sub.hours)}`,
            12,
            y
          );
          y += 4;

          const topics =
            result.aiPlan?.dailyTopics?.[`Day ${day.day}`]?.[sub.name] || [];

          topics.forEach((t) => {
            doc.text(`   - ${t}`, 16, y);
            y += 4;
          });
        });
      }

      y += 4;
    });

    doc.save(`${plan.title.replace(/\s+/g, "_")}_Plan.pdf`);
  };

  // Auth Loading indicator
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8 transition-colors">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-xs text-slate-400">Authenticating session...</span>
      </div>
    );
  }

  // Not authenticated -> show login form page
  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <DashboardLayout view={view} setView={setView}>
      {view === "dashboard" && (
        <Dashboard
          plans={plans}
          setView={setView}
          onViewPlan={(plan) => setSelectedPlanForModal(plan)}
          onDeletePlan={handleDeletePlan}
          onDownloadPDF={downloadPlanPDF}
        />
      )}

      {view === "planner" && (
        <Planner
          setView={setView}
          onPlanGenerated={fetchPlans}
        />
      )}

      {view === "my-plans" && (
        <MyPlans
          plans={plans}
          loading={plansLoading}
          error={plansError}
          onDeletePlan={handleDeletePlan}
          onViewPlan={(plan) => setSelectedPlanForModal(plan)}
          onDownloadPDF={downloadPlanPDF}
          onCreatePlanClick={() => setView("planner")}
        />
      )}

      {view === "analytics" && (
        <Analytics plans={plans} />
      )}

      {view === "settings" && (
        <Settings user={user} />
      )}

      {/* Plan Details Modal */}
      {selectedPlanForModal && (
        <PlanDetailModal
          plan={selectedPlanForModal}
          onClose={() => {
            fetchPlans(); // Sync data on close
            setSelectedPlanForModal(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
