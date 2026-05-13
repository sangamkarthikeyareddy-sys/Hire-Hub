import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, ExternalLink, Building2, DollarSign, Zap, Database, Briefcase } from "lucide-react";
import { useBookmarks } from "../context/BookmarkContext";
import { useHireHubAuth } from "../context/AuthContext";
import { useJobDetail } from "../hooks/useJobs";

const typeColors = {
    full_time: "bg-green-100 text-green-800",
    contract: "bg-blue-100 text-blue-800",
    part_time: "bg-yellow-100 text-yellow-800",
    freelance: "bg-purple-100 text-purple-800",
    internship: "bg-pink-100 text-pink-800",
};

const SOURCE_BADGE = {
    JSearch:   { icon: Zap,       color: "bg-amber-50 text-amber-700 border-amber-200" },
    Adzuna:    { icon: Database,   color: "bg-violet-50 text-violet-700 border-violet-200" },
    Arbeitnow: { icon: Briefcase,  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    TheMuse:   { icon: Building2,  color: "bg-pink-50 text-pink-700 border-pink-200" },
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
                    <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <p className="text-gray-400 text-sm">Loading job details…</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500 text-lg">{error || "Job not found"}</p>
                <button
                    onClick={() => navigate("/jobs")}
                    className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                    ← Back to Jobs
                </button>
            </div>
        );
    }

    const bookmarked = isBookmarked(job.id);
    const badge = typeColors[job.job_type] || "bg-gray-100 text-gray-700";
    const srcMeta = SOURCE_BADGE[job.source] || SOURCE_BADGE.Arbeitnow;
    const SrcIcon = srcMeta.icon;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="lg:w-[65%]">
                    <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8">
                        {/* Source badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${srcMeta.color}`}>
                                <SrcIcon className="w-3 h-3" />
                                {job.source}
                                {job.source === "JSearch" && " (Indeed/LinkedIn)"}
                                {job.source === "Adzuna" && " (Global Jobs)"}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Live
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {job.title}
                        </h1>
                        <p className="mt-1 text-gray-500">{job.company_name}</p>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {job.tags.map((tag, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div
                            className="mt-6 prose prose-sm prose-gray max-w-none [&_a]:text-blue-500 [&_a]:no-underline [&_a:hover]:underline [&_img]:rounded-lg [&_ul]:list-disc [&_ol]:list-decimal"
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-[35%]">
                    <div className="bg-white border border-gray-100 rounded-xl p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-5">
                            {job.company_logo ? (
                                <img
                                    src={job.company_logo}
                                    alt={job.company_name}
                                    className="w-14 h-14 rounded-xl object-contain bg-gray-50 p-1.5"
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
                                <h3 className="font-semibold text-gray-900">
                                    {job.company_name}
                                </h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5" />
                                    Company
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {job.candidate_required_location || "Remote"}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`rounded-full text-xs font-medium px-3 py-1 ${badge}`}>
                                    {formatJobType(job.job_type)}
                                </span>
                            </div>
                            {job.salary && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
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
                                    className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                                >
                                    Apply Now
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    bookmarked ? removeBookmark(job.id) : addBookmark(job)
                                }
                                className={`flex items-center justify-center gap-2 w-full rounded-lg px-5 py-2.5 text-sm font-medium transition-colors border ${bookmarked
                                        ? "bg-blue-50 border-blue-200 text-blue-600"
                                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                                    }`}
                            >
                                <Heart
                                    className={`w-4 h-4 ${bookmarked ? "fill-blue-500 text-blue-500" : ""
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