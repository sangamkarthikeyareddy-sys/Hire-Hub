// ─── Jobs.jsx ───────────────────────────────────────────────
// This page shows all available job listings with real-time data
// from multiple job APIs (JSearch, Adzuna, Arbeitnow, TheMuse).
// Users can filter by source, search, category, and job type.

// Import React library
import React from "react";
// Import hook to read URL query parameters (e.g., ?q=react)
import { useSearchParams } from "react-router-dom";
// Import icons used for source tabs and UI states
import { RefreshCw, WifiOff, Globe, Zap, Database, Briefcase, Building2 } from "lucide-react";
// Import the JobCard component that renders each job listing
import JobCard from "../components/hirehub/JobCard";
// Import the FilterBar component for search + category + type filters
import FilterBar from "../components/hirehub/FilterBar";
// Import the custom hook that fetches jobs from all APIs
import { useJobs } from "../hooks/useJobs";

// ─── Source Tab Styles ──────────────────────────────────────
// Each job source (API) gets a unique color scheme for its tab button.
// "bg" = inactive style, "activeBg" = style when this source is selected
const SOURCE_META = {
    All:       { icon: Globe,     bg: "border-blue-500/30 text-blue-400",     activeBg: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" },
    JSearch:   { icon: Zap,       bg: "border-amber-500/30 text-amber-400",   activeBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" },
    Adzuna:    { icon: Database,   bg: "border-violet-500/30 text-violet-400", activeBg: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25" },
    Arbeitnow: { icon: Briefcase,  bg: "border-emerald-500/30 text-emerald-400", activeBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" },
    TheMuse:   { icon: Building2,  bg: "border-pink-500/30 text-pink-400",      activeBg: "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25" },
};

// ─── Extra labels shown next to source names ────────────────
// Helps users understand what each API specializes in
const SOURCE_LABELS = {
    JSearch:   "(Indeed/LinkedIn)",   // JSearch aggregates Indeed & LinkedIn jobs
    Adzuna:    "(India/Global)",      // Adzuna covers Indian & global markets
    Arbeitnow: "(Remote/Tech)",       // Arbeitnow focuses on remote tech jobs
    TheMuse:   "(Top Companies)",     // TheMuse features top company profiles
};

// ─── Jobs Page Component ────────────────────────────────────
export default function Jobs() {
    // Read the "q" query parameter from the URL for initial search
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || ""; // e.g., /jobs?q=react → "react"

    // ── Use the custom useJobs hook to fetch and manage job data ──
    // This hook handles: API calls, filtering, searching, and source switching
    const {
        jobs,              // Array of job listings (filtered)
        loading,           // Boolean: are we currently fetching data?
        error,             // Error message string (if any)
        activeSource,      // Currently selected source tab ("All", "JSearch", etc.)
        setActiveSource,   // Function to switch the active source
        availableSources,  // Array of source names that have data
        activeSources,     // Array of sources currently contributing data
        search,            // Current search text
        setSearch,         // Function to update search text
        category,          // Currently selected category filter
        setCategory,       // Function to update category
        jobType,           // Currently selected job type filter
        setJobType,        // Function to update job type
        categories,        // List of available categories to filter by
        jobTypes,          // List of available job types to filter by
        clearFilters,      // Function to reset all filters
        refresh,           // Function to re-fetch data from APIs
    } = useJobs(initialQuery);

    // ── Loading State ──
    // Show a spinner and message while jobs are being fetched
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                {/* Animated spinning circle */}
                <div className="relative">
                    <div className="w-14 h-14 border-4 rounded-full" style={{ borderColor: "rgba(59,130,246,0.2)" }} />
                    <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <div className="text-center">
                    <p className="font-medium" style={{ color: "#cbd5e1" }}>Fetching real-time jobs…</p>
                    {/* Show which sources we're searching */}
                    <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        {activeSource === "All"
                            ? "Searching JSearch, Adzuna, Arbeitnow & TheMuse"
                            : `Searching ${activeSource}`}
                    </p>
                </div>
            </div>
        );
    }

    // ── Error State ──
    // Show error message with a "Try Again" button
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="rounded-xl p-8 text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {/* Warning icon */}
                    <WifiOff className="w-10 h-10 mx-auto mb-3" style={{ color: "#f87171" }} />
                    <p className="font-medium" style={{ color: "#f87171" }}>
                        Something went wrong: {error}
                    </p>
                    {/* Retry button */}
                    <button
                        onClick={refresh}
                        className="mt-4 inline-flex items-center gap-2 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                        style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── Main Content ──
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* ── Page Header ──────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    {/* Page title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Real-Time Jobs
                    </h1>
                    {/* Subtitle showing which sources are active */}
                    <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        Live data from {activeSources.length > 0 ? activeSources.join(", ") : "multiple sources"}
                    </p>
                </div>
                {/* Refresh button — re-fetches all job data */}
                <button
                    onClick={refresh}
                    className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 transition-all"
                    style={{ color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* ── Source Tabs (All, JSearch, Adzuna, etc.) ── */}
            {/* Each tab filters jobs to show only those from that specific API */}
            <div className="flex flex-wrap gap-2 mb-5">
                {availableSources.map((src) => {
                    const meta = SOURCE_META[src] || SOURCE_META.All; // Get style for this source
                    const Icon = meta.icon;                            // Get icon for this source
                    const isActive = activeSource === src;             // Is this tab currently selected?
                    const label = SOURCE_LABELS[src] || "";            // Extra label text

                    return (
                        <button
                            key={src}
                            onClick={() => setActiveSource(src)} // Switch to this source
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                                isActive
                                    ? meta.activeBg + " border-transparent"   // Active: gradient bg + no border
                                    : meta.bg + " hover:-translate-y-0.5"     // Inactive: outlined + hover lift
                            }`}
                            style={!isActive ? { background: "rgba(255,255,255,0.04)" } : {}}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {src}
                            {/* Show extra label if available (e.g., "(Indeed/LinkedIn)") */}
                            {label && (
                                <span className="text-[10px] opacity-70 ml-0.5">{label}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Filter Bar (Search, Category, Job Type) ── */}
            <FilterBar
                search={search}             // Current search text
                setSearch={setSearch}        // Update search text
                category={category}         // Selected category
                setCategory={setCategory}   // Update category
                jobType={jobType}           // Selected job type
                setJobType={setJobType}     // Update job type
                categories={categories}     // Available categories list
                jobTypes={jobTypes}         // Available job types list
                jobCount={jobs.length}      // Total number of matching jobs
                onClear={clearFilters}      // Reset all filters
            />

            {/* ── Job Cards Grid ─────────────────────────── */}
            {jobs.length === 0 ? (
                // No results — show empty state with "Clear filters" button
                <div className="text-center py-16">
                    <p className="text-lg" style={{ color: "#64748b" }}>No jobs match your filters.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                // Show jobs in a responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}