import React from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, WifiOff, Globe, Zap, Database, Briefcase, Building2 } from "lucide-react";
import JobCard from "../components/hirehub/JobCard";
import FilterBar from "../components/hirehub/FilterBar";
import { useJobs } from "../hooks/useJobs";

/* ── Source icon & colour map ────────────────────────────── */
const SOURCE_META = {
    All:       { icon: Globe,     bg: "border-blue-500/30 text-blue-400",     activeBg: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" },
    JSearch:   { icon: Zap,       bg: "border-amber-500/30 text-amber-400",   activeBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" },
    Adzuna:    { icon: Database,   bg: "border-violet-500/30 text-violet-400", activeBg: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25" },
    Arbeitnow: { icon: Briefcase,  bg: "border-emerald-500/30 text-emerald-400", activeBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" },
    TheMuse:   { icon: Building2,  bg: "border-pink-500/30 text-pink-400",      activeBg: "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25" },
};

const SOURCE_LABELS = {
    JSearch:   "(Indeed/LinkedIn)",
    Adzuna:    "(India/Global)",
    Arbeitnow: "(Remote/Tech)",
    TheMuse:   "(Top Companies)",
};

export default function Jobs() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const {
        jobs,
        loading,
        error,
        activeSource,
        setActiveSource,
        availableSources,
        activeSources,
        search,
        setSearch,
        category,
        setCategory,
        jobType,
        setJobType,
        categories,
        jobTypes,
        clearFilters,
        refresh,
    } = useJobs(initialQuery);

    /* ── Loading ──────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-14 h-14 border-4 rounded-full" style={{ borderColor: "rgba(59,130,246,0.2)" }} />
                    <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <div className="text-center">
                    <p className="font-medium" style={{ color: "#cbd5e1" }}>Fetching real-time jobs…</p>
                    <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        {activeSource === "All"
                            ? "Searching JSearch, Adzuna, Arbeitnow & TheMuse"
                            : `Searching ${activeSource}`}
                    </p>
                </div>
            </div>
        );
    }

    /* ── Error ─────────────────────────────────────────────── */
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="rounded-xl p-8 text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <WifiOff className="w-10 h-10 mx-auto mb-3" style={{ color: "#f87171" }} />
                    <p className="font-medium" style={{ color: "#f87171" }}>
                        Something went wrong: {error}
                    </p>
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Real-Time Jobs
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        Live data from {activeSources.length > 0 ? activeSources.join(", ") : "multiple sources"}
                    </p>
                </div>
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

            {/* ── Source Tabs ─────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-5">
                {availableSources.map((src) => {
                    const meta = SOURCE_META[src] || SOURCE_META.All;
                    const Icon = meta.icon;
                    const isActive = activeSource === src;
                    const label = SOURCE_LABELS[src] || "";

                    return (
                        <button
                            key={src}
                            onClick={() => setActiveSource(src)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                                isActive
                                    ? meta.activeBg + " border-transparent"
                                    : meta.bg + " hover:-translate-y-0.5"
                            }`}
                            style={!isActive ? { background: "rgba(255,255,255,0.04)" } : {}}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {src}
                            {label && (
                                <span className="text-[10px] opacity-70 ml-0.5">{label}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Filters ─────────────────────────────────────── */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                jobType={jobType}
                setJobType={setJobType}
                categories={categories}
                jobTypes={jobTypes}
                jobCount={jobs.length}
                onClear={clearFilters}
            />

            {/* ── Job Grid ────────────────────────────────────── */}
            {jobs.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}