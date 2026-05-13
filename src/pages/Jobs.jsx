import React from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, WifiOff, Globe, Zap, Database, Briefcase, Building2 } from "lucide-react";
import JobCard from "../components/hirehub/JobCard";
import FilterBar from "../components/hirehub/FilterBar";
import { useJobs } from "../hooks/useJobs";

/* ── Source icon & colour map ────────────────────────────── */
const SOURCE_META = {
    All:       { icon: Globe,     bg: "bg-blue-50 text-blue-700 border-blue-200",     activeBg: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" },
    JSearch:   { icon: Zap,       bg: "bg-amber-50 text-amber-700 border-amber-200",   activeBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" },
    Adzuna:    { icon: Database,   bg: "bg-violet-50 text-violet-700 border-violet-200", activeBg: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25" },
    Arbeitnow: { icon: Briefcase,  bg: "bg-emerald-50 text-emerald-700 border-emerald-200", activeBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" },
    TheMuse:   { icon: Building2,  bg: "bg-pink-50 text-pink-700 border-pink-200",      activeBg: "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25" },
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
                    <div className="w-14 h-14 border-4 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <div className="text-center">
                    <p className="text-gray-700 font-medium">Fetching real-time jobs…</p>
                    <p className="text-gray-400 text-sm mt-1">
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
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <WifiOff className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <p className="text-red-600 font-medium">
                        Something went wrong: {error}
                    </p>
                    <button
                        onClick={refresh}
                        className="mt-4 inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Real-Time Jobs
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Live data from {activeSources.length > 0 ? activeSources.join(", ") : "multiple sources"}
                    </p>
                </div>
                <button
                    onClick={refresh}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors rounded-lg border border-gray-200 px-4 py-2 hover:border-blue-300 hover:bg-blue-50"
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
                                    : meta.bg + " hover:shadow-md hover:-translate-y-0.5"
                            }`}
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
                    <p className="text-gray-400 text-lg">No jobs match your filters.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
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