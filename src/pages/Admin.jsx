import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useHireHubAuth } from "../context/AuthContext";
import { LogOut, Plus, Trash2, CheckCircle } from "lucide-react";
import ProfileCard from "../components/hirehub/ProfileCard";

const JOB_TYPES = [
    "full_time",
    "contract",
    "part_time",
    "freelance",
    "internship",
    "other",
];

function formatJobType(type) {
    if (!type) return "";
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const typeColors = {
    full_time: "bg-emerald-500/15 text-emerald-400",
    contract: "bg-blue-500/15 text-blue-400",
    part_time: "bg-amber-500/15 text-amber-400",
    freelance: "bg-violet-500/15 text-violet-400",
    internship: "bg-pink-500/15 text-pink-400",
    other: "bg-slate-500/15 text-slate-400",
};

export default function Admin() {
    const { logout } = useHireHubAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        title: "",
        company_name: "",
        category: "",
        job_type: "full_time",
        candidate_required_location: "",
        salary: "",
        description: "",
    });

    useEffect(() => {
        fetch("https://remotive.com/api/remote-jobs")
            .then((res) => res.json())
            .then((data) => {
                setJobs(data.jobs || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = useMemo(() => {
        const unique = [...new Set(jobs.map((j) => j.category).filter(Boolean))];
        return unique.sort();
    }, [jobs]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.company_name) return;

        const newJob = {
            id: Date.now(),
            ...form,
            publication_date: new Date().toISOString(),
            company_logo: null,
            url: "#",
        };
        setJobs((prev) => [newJob, ...prev]);
        setForm({
            title: "",
            company_name: "",
            category: "",
            job_type: "full_time",
            candidate_required_location: "",
            salary: "",
            description: "",
        });
        showToast("Job posted successfully!");
    };

    const handleDelete = (id) => {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        showToast("Job removed");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const inputStyle = {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#e2e8f0",
        caretColor: "#60a5fa",
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Toast */}
            {toast && (
                <div className="fixed top-20 right-4 z-50 rounded-xl px-5 py-3 flex items-center gap-2"
                    style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium" style={{ color: "#cbd5e1" }}>{toast}</span>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Admin Panel
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            <div className="space-y-6">
                <ProfileCard />

                {/* Post New Job */}
                <div className="rounded-xl p-6"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-400" />
                        Post New Job
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                    Job Title *
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={inputStyle}
                                    placeholder="e.g. Senior React Developer"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                    Company Name *
                                </label>
                                <input
                                    value={form.company_name}
                                    onChange={(e) =>
                                        setForm({ ...form, company_name: e.target.value })
                                    }
                                    required
                                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={inputStyle}
                                    placeholder="e.g. TechCorp"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={inputStyle}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                    Job Type
                                </label>
                                <select
                                    value={form.job_type}
                                    onChange={(e) =>
                                        setForm({ ...form, job_type: e.target.value })
                                    }
                                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={inputStyle}
                                >
                                    {JOB_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {formatJobType(t)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                    Location
                                </label>
                                <input
                                    value={form.candidate_required_location}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            candidate_required_location: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={inputStyle}
                                    placeholder="e.g. Remote, Worldwide"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                    Salary (optional)
                                </label>
                                <input
                                    value={form.salary}
                                    onChange={(e) =>
                                        setForm({ ...form, salary: e.target.value })
                                    }
                                    className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={inputStyle}
                                    placeholder="e.g. $80k - $120k"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block" style={{ color: "#94a3b8" }}>
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                rows={6}
                                className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                style={inputStyle}
                                placeholder="Job description..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            Post Job
                        </button>
                    </form>
                </div>

                {/* Manage Jobs */}
                <div className="rounded-xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 className="text-lg font-semibold text-white">
                            Manage Jobs ({jobs.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin" style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3b82f6" }} />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                                        <th className="px-6 py-3 font-medium text-left" style={{ color: "#64748b" }}>Title</th>
                                        <th className="px-6 py-3 font-medium text-left" style={{ color: "#64748b" }}>Company</th>
                                        <th className="px-6 py-3 font-medium text-left" style={{ color: "#64748b" }}>Type</th>
                                        <th className="px-6 py-3 font-medium text-left" style={{ color: "#64748b" }}>Location</th>
                                        <th className="px-6 py-3 font-medium text-left" style={{ color: "#64748b" }}>Posted</th>
                                        <th className="px-6 py-3 font-medium text-left" style={{ color: "#64748b" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.slice(0, 20).map((job) => (
                                        <tr key={job.id}
                                            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <td className="px-6 py-3 font-medium text-white max-w-[200px] truncate">
                                                {job.title}
                                            </td>
                                            <td className="px-6 py-3" style={{ color: "#64748b" }}>
                                                {job.company_name}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`rounded-full text-xs font-medium px-3 py-1 ${typeColors[job.job_type] || typeColors.other
                                                        }`}
                                                >
                                                    {formatJobType(job.job_type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 max-w-[150px] truncate" style={{ color: "#64748b" }}>
                                                {job.candidate_required_location || "Remote"}
                                            </td>
                                            <td className="px-6 py-3" style={{ color: "#475569" }}>
                                                {job.publication_date
                                                    ? new Date(job.publication_date).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    style={{ color: "#475569" }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "transparent"; }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}