import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, ExternalLink, Building2, DollarSign, Zap, Database, Briefcase } from "lucide-react";
import { useBookmarks } from "../context/BookmarkContext";
import { useHireHubAuth } from "../context/AuthContext";
import { useJobDetail } from "../hooks/useJobs";

const typeColors = {
    full_time: "bg-emerald-500/15 text-emerald-400",
    contract: "bg-blue-500/15 text-blue-400",
    part_time: "bg-amber-500/15 text-amber-400",
    freelance: "bg-violet-500/15 text-violet-400",
    internship: "bg-pink-500/15 text-pink-400",
};

const SOURCE_BADGE = {
    JSearch:   { icon: Zap,       color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
    Adzuna:    { icon: Database,   color: "text-violet-400 bg-violet-500/15 border-violet-500/30" },
    Arbeitnow: { icon: Briefcase,  color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
    TheMuse:   { icon: Building2,  color: "text-pink-400 bg-pink-500/15 border-pink-500/30" },
};

function formatJobType(type) {
    if (!type) return "Other";
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
    const { isLoggedIn } = useHireHubAuth();
    const { job, loading, error } = useJobDetail(id);

    useEffect(() => {
        // Increment jobs browsed count
        const count = parseInt(localStorage.getItem("hirehub_jobs_browsed") || "0", 10);
        localStorage.setItem("hirehub_jobs_browsed", String(count + 1));
    }, [id]);

    // Auto-open apply link if redirected back after login
    useEffect(() => {
        if (searchParams.get("apply") === "true" && isLoggedIn && job?.url) {
            window.open(job.url, "_blank", "noopener,noreferrer");
        }
    }, [searchParams, isLoggedIn, job]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <div className="relative">
                    <div className="w-12 h-12 border-4 rounded-full" style={{ borderColor: "rgba(59,130,246,0.2)" }} />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <p className="text-sm" style={{ color: "#64748b" }}>Loading job details…</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-lg" style={{ color: "#64748b" }}>{error || "Job not found"}</p>
                <button
                    onClick={() => navigate("/jobs")}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    ← Back to Jobs
                </button>
            </div>
        );
    }

    const bookmarked = isBookmarked(job.id);
    const badge = typeColors[job.job_type] || "bg-slate-500/15 text-slate-400";
    const srcMeta = SOURCE_BADGE[job.source] || SOURCE_BADGE.Arbeitnow;
    const SrcIcon = srcMeta.icon;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm mb-6 transition-colors"
                style={{ color: "#64748b" }}
                onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="lg:w-[65%]">
                    <div className="rounded-xl p-6 md:p-8"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {/* Source badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${srcMeta.color}`}>
                                <SrcIcon className="w-3 h-3" />
                                {job.source}
                                {job.source === "JSearch" && " (Indeed/LinkedIn)"}
                                {job.source === "Adzuna" && " (Global Jobs)"}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#34d399" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {job.title}
                        </h1>
                        <p className="mt-1" style={{ color: "#64748b" }}>{job.company_name}</p>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {job.tags.map((tag, i) => (
                                    <span key={i} className="text-xs rounded-full px-3 py-1"
                                        style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div
                            className="mt-6 prose prose-sm prose-invert max-w-none [&_a]:text-blue-400 [&_a]:no-underline [&_a:hover]:underline [&_img]:rounded-lg [&_ul]:list-disc [&_ol]:list-decimal"
                            style={{ color: "#94a3b8" }}
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-[35%]">
                    <div className="rounded-xl p-6 sticky top-24"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-3 mb-5">
                            {job.company_logo ? (
                                <img
                                    src={job.company_logo}
                                    alt={job.company_name}
                                    className="w-14 h-14 rounded-xl object-contain p-1.5"
                                    style={{ background: "rgba(255,255,255,0.06)" }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const next = e.currentTarget.nextElementSibling;
                                        if (next) next.style.display = "flex";
                                    }}
                                />
                            ) : null}
                            <div
                                className="w-14 h-14 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"
                                style={{ display: job.company_logo ? "none" : "flex" }}
                            >
                                {job.company_name?.[0] || "?"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    {job.company_name}
                                </h3>
                                <p className="text-sm flex items-center gap-1" style={{ color: "#64748b" }}>
                                    <Building2 className="w-3.5 h-3.5" />
                                    Company
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                                <MapPin className="w-4 h-4" style={{ color: "#64748b" }} />
                                {job.candidate_required_location || "Remote"}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`rounded-full text-xs font-medium px-3 py-1 ${badge}`}>
                                    {formatJobType(job.job_type)}
                                </span>
                            </div>
                            {job.salary && (
                                <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                                    <DollarSign className="w-4 h-4" style={{ color: "#64748b" }} />
                                    {job.salary}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {job.url && (
                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            navigate(`/login?redirect=${encodeURIComponent(`/jobs/${job.id}?apply=true`)}`);
                                        } else {
                                            window.open(job.url, "_blank", "noopener,noreferrer");
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 w-full text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
                                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                                >
                                    Apply Now
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    bookmarked ? removeBookmark(job.id) : addBookmark(job)
                                }
                                className="flex items-center justify-center gap-2 w-full rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                                style={bookmarked
                                    ? { background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }
                                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }
                                }
                            >
                                <Heart
                                    className={`w-4 h-4 ${bookmarked ? "fill-blue-400 text-blue-400" : ""
                                        }`}
                                />
                                {bookmarked ? "Saved" : "Save Job"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}