// ─── JobDetail.jsx ──────────────────────────────────────────
// This page shows the full details of a single job posting.
// It includes the job description, company info, location,
// salary, and buttons to apply or save the job.

// Import React and the useEffect hook for side effects
import React, { useEffect } from "react";
// Import routing hooks: useParams gets the job ID from the URL,
// useNavigate lets us go to other pages, useSearchParams reads URL query params
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// Import icons from the lucide-react icon library
import { ArrowLeft, MapPin, Heart, ExternalLink, Building2, DollarSign, Zap, Database, Briefcase } from "lucide-react";
// Import bookmark functions to save/unsave jobs
import { useBookmarks } from "../context/BookmarkContext";
// Import auth hook to check if user is logged in
import { useHireHubAuth } from "../context/AuthContext";
// Import custom hook that fetches job details from the API
import { useJobDetail } from "../hooks/useJobs";

// ─── Color styles for different job types ───────────────────
// Each job type gets a unique color badge (e.g., full-time = green)
const typeColors = {
    full_time: "bg-emerald-500/15 text-emerald-400",   // Green for full-time
    contract: "bg-blue-500/15 text-blue-400",           // Blue for contract
    part_time: "bg-amber-500/15 text-amber-400",        // Amber for part-time
    freelance: "bg-violet-500/15 text-violet-400",      // Violet for freelance
    internship: "bg-pink-500/15 text-pink-400",         // Pink for internship
};

// ─── Badge styles for different job data sources ────────────
// Shows which API the job came from (JSearch, Adzuna, etc.)
const SOURCE_BADGE = {
    JSearch:   { icon: Zap,       color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
    Adzuna:    { icon: Database,   color: "text-violet-400 bg-violet-500/15 border-violet-500/30" },
    Arbeitnow: { icon: Briefcase,  color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
    TheMuse:   { icon: Building2,  color: "text-pink-400 bg-pink-500/15 border-pink-500/30" },
};

// ─── Helper: Convert job type string to readable format ─────
// Example: "full_time" → "Full Time"
function formatJobType(type) {
    if (!type) return "Other"; // If no type provided, show "Other"
    return type
        .replace(/_/g, " ")                    // Replace underscores with spaces
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
}

// ─── JobDetail Page Component ───────────────────────────────
export default function JobDetail() {
    // Get the job ID from the URL (e.g., /jobs/123 → id = "123")
    const { id } = useParams();
    // Navigation function to go to other pages
    const navigate = useNavigate();
    // Read URL query parameters (used for auto-apply after login redirect)
    const [searchParams] = useSearchParams();
    // Bookmark functions: check if saved, add to saved, remove from saved
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
    // Check if the user is currently logged in
    const { isLoggedIn } = useHireHubAuth();
    // Fetch the job details from the API using the job ID
    const { job, loading, error } = useJobDetail(id);

    // ── Track how many jobs the user has browsed ──
    // Increments a counter in localStorage each time a job is viewed
    useEffect(() => {
        const count = parseInt(localStorage.getItem("hirehub_jobs_browsed") || "0", 10);
        localStorage.setItem("hirehub_jobs_browsed", String(count + 1));
    }, [id]); // Runs whenever the job ID changes

    // ── Auto-open the apply link after login redirect ──
    // If the user clicked "Apply" but wasn't logged in, they get redirected
    // to login first. After login, they come back here with ?apply=true in the URL,
    // and this automatically opens the application link.
    useEffect(() => {
        if (searchParams.get("apply") === "true" && isLoggedIn && job?.url) {
            window.open(job.url, "_blank", "noopener,noreferrer");
        }
    }, [searchParams, isLoggedIn, job]);

    // ── Loading state: show a spinner while fetching job data ──
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                {/* Animated spinning circle */}
                <div className="relative">
                    <div className="w-12 h-12 border-4 rounded-full" style={{ borderColor: "rgba(59,130,246,0.2)" }} />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <p className="text-sm" style={{ color: "#64748b" }}>Loading job details…</p>
            </div>
        );
    }

    // ── Error state: show error message if job couldn't be loaded ──
    if (error || !job) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-lg" style={{ color: "#64748b" }}>{error || "Job not found"}</p>
                {/* Button to go back to the jobs listing */}
                <button
                    onClick={() => navigate("/jobs")}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    ← Back to Jobs
                </button>
            </div>
        );
    }

    // ── Prepare display values ──
    const bookmarked = isBookmarked(job.id); // Is this job currently saved?
    const badge = typeColors[job.job_type] || "bg-slate-500/15 text-slate-400"; // Job type badge color
    const srcMeta = SOURCE_BADGE[job.source] || SOURCE_BADGE.Arbeitnow; // Source badge style
    const SrcIcon = srcMeta.icon; // Icon component for the source badge

    // ── Render the job detail page ──
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back button — goes to the previous page */}
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

            {/* Two-column layout: main content on left, sidebar on right */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* ── Left Column: Job Description ──────────────── */}
                <div className="lg:w-[65%]">
                    <div className="rounded-xl p-6 md:p-8"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

                        {/* Source badge — shows which API this job came from */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${srcMeta.color}`}>
                                <SrcIcon className="w-3 h-3" />
                                {job.source}
                                {/* Show additional source info for specific APIs */}
                                {job.source === "JSearch" && " (Indeed/LinkedIn)"}
                                {job.source === "Adzuna" && " (Global Jobs)"}
                            </span>
                            {/* Green "Live" indicator showing this is real-time data */}
                            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#34d399" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </span>
                        </div>

                        {/* Job title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {job.title}
                        </h1>
                        {/* Company name */}
                        <p className="mt-1" style={{ color: "#64748b" }}>{job.company_name}</p>

                        {/* Tags — skill/technology tags if available */}
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

                        {/* Job description — rendered as HTML (comes from API) */}
                        <div
                            className="mt-6 prose prose-sm prose-invert max-w-none [&_a]:text-blue-400 [&_a]:no-underline [&_a:hover]:underline [&_img]:rounded-lg [&_ul]:list-disc [&_ol]:list-decimal"
                            style={{ color: "#94a3b8" }}
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>
                </div>

                {/* ── Right Column: Sidebar (Company + Actions) ── */}
                <div className="lg:w-[35%]">
                    {/* Sticky sidebar — stays visible when scrolling */}
                    <div className="rounded-xl p-6 sticky top-24"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

                        {/* Company logo and name */}
                        <div className="flex items-center gap-3 mb-5">
                            {/* Show company logo if available */}
                            {job.company_logo ? (
                                <img
                                    src={job.company_logo}
                                    alt={job.company_name}
                                    className="w-14 h-14 rounded-xl object-contain p-1.5"
                                    style={{ background: "rgba(255,255,255,0.06)" }}
                                    // If the logo image fails to load, hide it and show the fallback
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const next = e.currentTarget.nextElementSibling;
                                        if (next) next.style.display = "flex";
                                    }}
                                />
                            ) : null}
                            {/* Fallback: show company initial as avatar if no logo */}
                            <div
                                className="w-14 h-14 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"
                                style={{ display: job.company_logo ? "none" : "flex" }}
                            >
                                {job.company_name?.[0] || "?"} {/* First letter of company name */}
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

                        {/* Job details: location, type, salary */}
                        <div className="space-y-3 mb-6">
                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                                <MapPin className="w-4 h-4" style={{ color: "#64748b" }} />
                                {job.candidate_required_location || "Remote"}
                            </div>
                            {/* Job type badge */}
                            <div className="flex items-center gap-2">
                                <span className={`rounded-full text-xs font-medium px-3 py-1 ${badge}`}>
                                    {formatJobType(job.job_type)}
                                </span>
                            </div>
                            {/* Salary — only shown if available */}
                            {job.salary && (
                                <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                                    <DollarSign className="w-4 h-4" style={{ color: "#64748b" }} />
                                    {job.salary}
                                </div>
                            )}
                        </div>

                        {/* Action buttons: Apply and Save */}
                        <div className="space-y-3">
                            {/* Apply Now button — opens the job application link */}
                            {job.url && (
                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            // If not logged in, redirect to login first
                                            // After login, they'll come back here with ?apply=true
                                            navigate(`/login?redirect=${encodeURIComponent(`/jobs/${job.id}?apply=true`)}`);
                                        } else {
                                            // If logged in, open the apply link in a new tab
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
                            {/* Save/Unsave Job button — toggles bookmark status */}
                            <button
                                onClick={() =>
                                    bookmarked ? removeBookmark(job.id) : addBookmark(job)
                                }
                                className="flex items-center justify-center gap-2 w-full rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                                style={bookmarked
                                    // If already saved: blue highlighted style
                                    ? { background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }
                                    // If not saved: neutral outline style
                                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }
                                }
                            >
                                {/* Heart icon — filled when bookmarked, outline when not */}
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