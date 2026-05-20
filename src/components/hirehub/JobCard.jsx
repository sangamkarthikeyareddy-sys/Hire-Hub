import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Heart, Clock, Zap, Database, Briefcase, Building2 } from "lucide-react";
import { useBookmarks } from "../../context/BookmarkContext";

const typeColors = {
    full_time: "bg-emerald-500/15 text-emerald-400",
    contract: "bg-blue-500/15 text-blue-400",
    part_time: "bg-amber-500/15 text-amber-400",
    freelance: "bg-violet-500/15 text-violet-400",
    internship: "bg-pink-500/15 text-pink-400",
};

const SOURCE_STYLE = {
    JSearch:   { icon: Zap,       color: "text-amber-400 bg-amber-500/15" },
    Adzuna:    { icon: Database,   color: "text-violet-400 bg-violet-500/15" },
    Arbeitnow: { icon: Briefcase,  color: "text-emerald-400 bg-emerald-500/15" },
    TheMuse:   { icon: Building2,  color: "text-pink-400 bg-pink-500/15" },
};

function formatJobType(type) {
    if (!type) return "Other";
    return type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function daysAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Math.floor(
        (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    if (diff < 0) return "Today";
    return `${diff} days ago`;
}

const initialColors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-rose-500",
];

function getColor(name) {
    if (!name) return initialColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return initialColors[Math.abs(hash) % initialColors.length];
}

export default function JobCard({ job, showRemove = false }) {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
    const bookmarked = isBookmarked(job.id);
    const badge = typeColors[job.job_type] || "bg-slate-500/15 text-slate-400";
    const src = SOURCE_STYLE[job.source] || SOURCE_STYLE.Arbeitnow;
    const SrcIcon = src.icon;

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (bookmarked) {
            removeBookmark(job.id);
        } else {
            addBookmark(job);
        }
    };

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeBookmark(job.id);
    };

    return (
        <Link to={`/jobs/${job.id}`} className="block group">
            <div className="rounded-xl p-6 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {job.company_logo ? (
                            <img
                                src={job.company_logo}
                                alt={job.company_name}
                                className="w-12 h-12 rounded-lg object-contain p-1"
                                style={{ background: "rgba(255,255,255,0.06)" }}
                                onError={(e) => {
                                    const image = e.currentTarget;
                                    const fallback = image.nextElementSibling;

                                    image.style.display = "none";
                                    if (fallback instanceof HTMLElement) {
                                        fallback.style.display = "flex";
                                    }
                                }}
                            />
                        ) : null}
                        <div
                            className={`w-12 h-12 rounded-lg ${getColor(job.company_name)} text-white flex items-center justify-center text-sm font-semibold`}
                            style={{ display: job.company_logo ? "none" : "flex" }}
                        >
                            {getInitials(job.company_name)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-sm leading-tight line-clamp-2 transition-colors"
                                style={{ color: "#e2e8f0" }}>
                                {job.title}
                            </h3>
                            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{job.company_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleBookmark}
                        className="flex-shrink-0 ml-2 p-1.5 rounded-full transition-colors"
                        style={{ color: bookmarked ? undefined : "#475569" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${bookmarked
                                    ? "fill-blue-400 text-blue-400"
                                    : ""
                                }`}
                        />
                    </button>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                            {job.candidate_required_location || "Remote"}
                        </span>
                    </div>

                    {/* Salary line */}
                    {job.salary && (
                        <p className="text-xs font-medium text-emerald-400 truncate">
                            {job.salary}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`rounded-full text-xs font-medium px-3 py-1 ${badge}`}
                            >
                                {formatJobType(job.job_type)}
                            </span>
                            {/* Source badge */}
                            {job.source && (
                                <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-medium px-2 py-0.5 ${src.color}`}>
                                    <SrcIcon className="w-2.5 h-2.5" />
                                    {job.source}
                                </span>
                            )}
                        </div>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
                            <Clock className="w-3 h-3" />
                            {daysAgo(job.publication_date)}
                        </span>
                    </div>
                </div>

                {showRemove && (
                    <button
                        onClick={handleRemove}
                        className="mt-3 w-full py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
                    >
                        Remove
                    </button>
                )}
            </div>
        </Link>
    );
}
