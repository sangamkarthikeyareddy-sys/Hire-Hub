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
    full_time: "bg-green-100 text-green-800",
    contract: "bg-blue-100 text-blue-800",
    part_time: "bg-yellow-100 text-yellow-800",
    freelance: "bg-purple-100 text-purple-800",
    internship: "bg-pink-100 text-pink-800",
    other: "bg-gray-100 text-gray-700",
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Toast */}
            {toast && (
                <div className="fixed top-20 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-5 py-3 flex items-center gap-2 animate-in slide-in-from-right">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{toast}</span>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Admin Panel
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            <div className="space-y-6">
                <ProfileCard />

                {/* Post New Job */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-500" />
                        Post New Job
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Job Title *
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Senior React Developer"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Company Name *
                                </label>
                                <input
                                    value={form.company_name}
                                    onChange={(e) =>
                                        setForm({ ...form, company_name: e.target.value })
                                    }
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. TechCorp"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Job Type
                                </label>
                                <select
                                    value={form.job_type}
                                    onChange={(e) =>
                                        setForm({ ...form, job_type: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    {JOB_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {formatJobType(t)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
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
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Remote, Worldwide"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Salary (optional)
                                </label>
                                <input
                                    value={form.salary}
                                    onChange={(e) =>
                                        setForm({ ...form, salary: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. $80k - $120k"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                rows={6}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Job description..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                        >
                            Post Job
                        </button>
                    </form>
                </div>

                {/* Manage Jobs */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Manage Jobs ({jobs.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-left">
                                        <th className="px-6 py-3 font-medium">Title</th>
                                        <th className="px-6 py-3 font-medium">Company</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Location</th>
                                        <th className="px-6 py-3 font-medium">Posted</th>
                                        <th className="px-6 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {jobs.slice(0, 20).map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                                                {job.title}
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
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
                                            <td className="px-6 py-3 text-gray-500 max-w-[150px] truncate">
                                                {job.candidate_required_location || "Remote"}
                                            </td>
                                            <td className="px-6 py-3 text-gray-400">
                                                {job.publication_date
                                                    ? new Date(job.publication_date).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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