// ─── JobCard.jsx ────────────────────────────────────────────
// This component renders a single job listing card.
// It's used on both the Jobs page and the Bookmarked Jobs section.
// Each card shows: company logo, job title, location, salary,
// job type badge, source badge, posting date, and a bookmark button.

// Import React library
import React from "react";
// Import Link for making the entire card clickable (navigates to job detail)
import { Link } from "react-router-dom";
// Import icons used in the card
import { MapPin, Heart, Clock, Zap, Database, Briefcase, Building2 } from "lucide-react";
// Import bookmark functions to save/unsave jobs
import { useBookmarks } from "../../context/BookmarkContext";

// ─── Color styles for different job types ───────────────────
// Each type gets a unique colored badge
const typeColors = {
    full_time: "bg-emerald-500/15 text-emerald-400",   // Green
    contract: "bg-blue-500/15 text-blue-400",           // Blue
    part_time: "bg-amber-500/15 text-amber-400",        // Amber
    freelance: "bg-violet-500/15 text-violet-400",      // Violet
    internship: "bg-pink-500/15 text-pink-400",         // Pink
};

// ─── Source badge styles ────────────────────────────────────
// Shows which API the job came from
const SOURCE_STYLE = {
    JSearch:   { icon: Zap,       color: "text-amber-400 bg-amber-500/15" },
    Adzuna:    { icon: Database,   color: "text-violet-400 bg-violet-500/15" },
    Arbeitnow: { icon: Briefcase,  color: "text-emerald-400 bg-emerald-500/15" },
    TheMuse:   { icon: Building2,  color: "text-pink-400 bg-pink-500/15" },
};

// ── Helper: format job type for display ──
// Converts "full_time" → "Full Time"
function formatJobType(type) {
    if (!type) return "Other";
    return type
        .replace(/_/g, " ")                    // Replace underscores with spaces
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
}

// ── Helper: get company initials for the fallback avatar ──
// "Google Inc" → "GI"
function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")          // Split into words
        .map((w) => w[0])    // Get first letter of each word
        .join("")            // Combine them
        .substring(0, 2)     // Take only first 2 letters
        .toUpperCase();      // Make uppercase
}

// ── Helper: calculate how many days ago a job was posted ──
// "2025-05-15" → "5 days ago"
function daysAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Math.floor(
        (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24) // Convert ms to days
    );
    if (diff === 0) return "Today";       // Posted today
    if (diff === 1) return "1 day ago";   // Posted yesterday
    if (diff < 0) return "Today";         // Future date = treat as today
    return `${diff} days ago`;            // X days ago
}

// ── Color palette for company initials avatar ──
// A random color is assigned based on the company name
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

// ── Helper: pick a consistent color for a company name ──
// Uses a hash function so the same company always gets the same color
function getColor(name) {
    if (!name) return initialColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return initialColors[Math.abs(hash) % initialColors.length];
}

// ─── JobCard Component ──────────────────────────────────────
// Props:
//   - job: the job data object
//   - showRemove: if true, show a "Remove" button (used on the bookmarks page)
export default function JobCard({ job, showRemove = false }) {
    // Get bookmark functions from context
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
    // Check if this job is already bookmarked
    const bookmarked = isBookmarked(job.id);
    // Get the color class for this job's type badge
    const badge = typeColors[job.job_type] || "bg-slate-500/15 text-slate-400";
    // Get the style for this job's source badge
    const src = SOURCE_STYLE[job.source] || SOURCE_STYLE.Arbeitnow;
    const SrcIcon = src.icon;

    // ── Toggle bookmark (save/unsave) ──
    // stopPropagation prevents the click from navigating to the job detail page
    const handleBookmark = (e) => {
        e.preventDefault();      // Don't follow the Link
        e.stopPropagation();     // Don't bubble up to parent
        if (bookmarked) {
            removeBookmark(job.id); // Remove from saved
        } else {
            addBookmark(job);       // Add to saved
        }
    };

    // ── Remove from bookmarks (on bookmarks page) ──
    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeBookmark(job.id);
    };

    return (
        // The entire card is a link — clicking anywhere navigates to the job detail page
        <Link to={`/jobs/${job.id}`} className="block group">
            <div className="rounded-xl p-6 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>

                {/* ── Top section: Company logo/initials + Job title + Bookmark button ── */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Company logo (if available) */}
                        {job.company_logo ? (
                            <img
                                src={job.company_logo}
                                alt={job.company_name}
                                className="w-12 h-12 rounded-lg object-contain p-1"
                                style={{ background: "rgba(255,255,255,0.06)" }}
                                // If the logo fails to load, hide it and show the fallback initials
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
                        {/* Fallback: colored circle with company initials */}
                        <div
                            className={`w-12 h-12 rounded-lg ${getColor(job.company_name)} text-white flex items-center justify-center text-sm font-semibold`}
                            style={{ display: job.company_logo ? "none" : "flex" }}
                        >
                            {getInitials(job.company_name)}
                        </div>
                        {/* Job title and company name */}
                        <div className="min-w-0">
                            <h3 className="font-semibold text-sm leading-tight line-clamp-2 transition-colors"
                                style={{ color: "#e2e8f0" }}>
                                {job.title}
                            </h3>
                            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{job.company_name}</p>
                        </div>
                    </div>
                    {/* Bookmark (heart) button */}
                    <button
                        onClick={handleBookmark}
                        className="flex-shrink-0 ml-2 p-1.5 rounded-full transition-colors"
                        style={{ color: bookmarked ? undefined : "#475569" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        {/* Heart icon — filled blue when bookmarked, outline when not */}
                        <Heart
                            className={`w-5 h-5 transition-colors ${bookmarked
                                    ? "fill-blue-400 text-blue-400"
                                    : ""
                                }`}
                        />
                    </button>
                </div>

                {/* ── Bottom section: Location, salary, badges, date ── */}
                <div className="mt-auto flex flex-col gap-3">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                            {job.candidate_required_location || "Remote"}
                        </span>
                    </div>

                    {/* Salary — only shown if available */}
                    {job.salary && (
                        <p className="text-xs font-medium text-emerald-400 truncate">
                            {job.salary}
                        </p>
                    )}

                    {/* Job type badge + Source badge + Posted date */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            {/* Job type badge (e.g., "Full Time") */}
                            <span
                                className={`rounded-full text-xs font-medium px-3 py-1 ${badge}`}
                            >
                                {formatJobType(job.job_type)}
                            </span>
                            {/* Source badge (e.g., "JSearch") */}
                            {job.source && (
                                <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-medium px-2 py-0.5 ${src.color}`}>
                                    <SrcIcon className="w-2.5 h-2.5" />
                                    {job.source}
                                </span>
                            )}
                        </div>
                        {/* How long ago the job was posted */}
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
                            <Clock className="w-3 h-3" />
                            {daysAgo(job.publication_date)}
                        </span>
                    </div>
                </div>

                {/* ── Remove button (only shown on the bookmarks/saved jobs page) ── */}
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
