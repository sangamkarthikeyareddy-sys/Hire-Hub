import React from "react";
import { Search, X } from "lucide-react";

function formatJobType(type) {
    if (!type) return "";
    return type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FilterBar({
    search,
    setSearch,
    category,
    setCategory,
    jobType,
    setJobType,
    categories,
    jobTypes,
    jobCount,
    onClear,
}) {
    const hasFilters = search || category !== "all" || jobType !== "all";

    return (
        <div className="rounded-xl p-4 md:p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or company..."
                            className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", caretColor: "#60a5fa" }}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}
                    >
                        <option value="all">All Types</option>
                        {jobTypes.map((t) => (
                            <option key={t} value={t}>
                                {formatJobType(t)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <p className="text-sm" style={{ color: "#64748b" }}>
                    Showing <span className="font-semibold" style={{ color: "#cbd5e1" }}>{jobCount}</span> jobs
                </p>
                {hasFilters && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1 text-sm transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                        onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}