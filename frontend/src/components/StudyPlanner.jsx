import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- Reusable Section ---------- */
function Section({ title, content }) {
    if (!content) return null;

    return (
        <div className="bg-gray-50 p-4 rounded-lg my-3">
            <h4 className="font-semibold mb-2">{title}</h4>
            <p className="text-sm whitespace-pre-line">{content}</p>
        </div>
    );
}

/* ---------- Utils ---------- */
function formatHours(hours = 0) {
    // If already a formatted string, return as-is
    if (typeof hours === "string") {
        return hours;
    }
    // If it's a number, format it
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (!h && !m) return "0 mins";
    return `${h ? `${h} hrs ` : ""}${m ? `${m} mins` : ""}`.trim();
}

/* ---------- Main ---------- */
export default function StudyPlanner() {
    const [subjects, setSubjects] = useState("");
    const [weakSubjects, setWeakSubjects] = useState("");
    const [examDate, setExamDate] = useState("");
    const [dailyHours, setDailyHours] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [showResult, setShowResult] = useState(false);

    /* ---------- Submit ---------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subjects || !examDate || !dailyHours) {
            setError("All required fields must be filled");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
                    weakSubjects: weakSubjects
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    examDate,
                    dailyHours: Number(dailyHours),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Server error");

            setResult(data);
            setShowResult(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- PDF ---------- */
    const downloadPDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        let y = 12;

        doc.setFontSize(16);
        doc.text("Personalized Study Plan", 105, y, { align: "center" });
        y += 10;

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
                `Day ${day.day} - ${day.date}${day.type === "revision" ? " (Revision/Test)" : ""
                }`,
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

        doc.save("Study_Plan.pdf");
    };

    /* ---------- UI ---------- */
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow p-6">
                {!showResult ? (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-center">
                            AI Study Planner
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Subjects (comma separated)"
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                            />

                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Weak subjects (optional)"
                                value={weakSubjects}
                                onChange={(e) => setWeakSubjects(e.target.value)}
                            />

                            <input
                                type="date"
                                className="w-full border p-2 rounded"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                            />

                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                placeholder="Daily study hours"
                                value={dailyHours}
                                onChange={(e) => setDailyHours(e.target.value)}
                            />

                            <button
                                className="w-full bg-blue-600 text-white p-2 rounded"
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Generate Plan"}
                            </button>
                        </form>

                        {error && <p className="text-red-600 mt-3">{error}</p>}
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">
                            Your Personalized Study Plan
                        </h2>

                        {/* Distribution */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {Object.entries(result.perDayHours || {}).map(([s, h]) => (
                                <div key={s} className="bg-blue-50 p-3 rounded text-center">
                                    <p className="font-semibold">{s}</p>
                                    <p className="text-blue-700">{formatHours(h)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Schedule + Topics */}
                        <div className="space-y-3">
                            {result.schedule.map((day) => (
                                <div key={day.day} className="border p-3 rounded">
                                    <strong>
                                        Day {day.day} – {day.date}
                                        {day.type === "revision" && " (Revision/Test)"}
                                    </strong>

                                    {day.type !== "revision" && (
                                        <ul className="ml-5 list-disc mt-2">
                                            {day.subjects.map((sub) => {
                                                const topics =
                                                    result.aiPlan?.dailyTopics?.[`Day ${day.day}`]?.[
                                                    sub.name
                                                    ] || [];

                                                return (
                                                    <li key={sub.name}>
                                                        <strong>{sub.name}</strong> –{" "}
                                                        {formatHours(sub.hours)}
                                                        {topics.length > 0 && (
                                                            <ul className="ml-5 list-disc text-sm text-gray-600">
                                                                {topics.map((t, i) => (
                                                                    <li key={i}>{t}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Section title="Overview" content={result.aiPlan?.overview} />
                        <Section title="Important Topics" content={result.aiPlan?.importantTopics} />
                        <Section title="Revision Strategy" content={result.aiPlan?.revisionStrategy} />
                        <Section title="Motivation" content={result.aiPlan?.motivation} />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowResult(false)}
                                className="flex-1 border border-blue-600 text-blue-600 p-2 rounded"
                            >
                                New Plan
                            </button>
                            <button
                                onClick={downloadPDF}
                                className="flex-1 bg-green-600 text-white p-2 rounded"
                            >
                                Download PDF
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
