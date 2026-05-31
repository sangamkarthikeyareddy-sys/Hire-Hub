// ─── FilterBar.jsx ──────────────────────────────────────────
// This component provides the search and filter controls on the Jobs page.
// It includes:
//   - A text search box (search by job title or company name)
//   - A category dropdown (e.g., "Engineering", "Marketing")
//   - A job type dropdown (e.g., "Full Time", "Contract")
//   - A "Clear Filters" button (shown only when filters are active)
//   - A count showing how many jobs match the current filters

// Import React library
import React from "react";
// Import icons for the search input and clear button
import { Search, X } from "lucide-react";

// ── Helper: convert job type to readable format ──
// Example: "full_time" → "Full Time"
function formatJobType(type) {
    if (!type) return "";
    return type
        .replace(/_/g, " ")                    // Replace underscores with spaces
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
}

// ─── FilterBar Component ────────────────────────────────────
// Receives filter state and setter functions from the parent (Jobs page)
export default function FilterBar({
    search,        // Current search text
    setSearch,     // Function to update search text
    category,      // Currently selected category (or "all")
    setCategory,   // Function to update category
    jobType,       // Currently selected job type (or "all")
    setJobType,    // Function to update job type
    categories,    // Array of available category options
    jobTypes,      // Array of available job type options
    jobCount,      // Number of jobs matching current filters
    onClear,       // Function to reset all filters
}) {
    // Check if any filters are currently active
    const hasFilters = search || category !== "all" || jobType !== "all";

    return (
        // Filter bar container with glass-like styling
        <div className="rounded-xl p-4 md:p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>

            {/* Top row: search input + dropdown filters */}
            <div className="flex flex-col md:flex-row gap-3 md:items-end">

                {/* ── Search Input ── */}
                <div className="flex-1">
                    <div className="relative">
                        {/* Search icon inside the input */}
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} // Update search as user types
                            placeholder="Search by title or company..."
                            className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", caretColor: "#60a5fa" }}
                        />
                    </div>
                </div>

                {/* ── Category & Job Type Dropdowns ── */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    {/* Category dropdown */}
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

                    {/* Job type dropdown */}
                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}
                    >
                        <option value="all">All Types</option>
                        {jobTypes.map((t) => (
                            <option key={t} value={t}>
                                {formatJobType(t)} {/* Convert "full_time" → "Full Time" */}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Bottom row: job count + clear filters ── */}
            <div className="mt-3 flex items-center justify-between">
                {/* Show how many jobs match the current filters */}
                <p className="text-sm" style={{ color: "#64748b" }}>
                    Showing <span className="font-semibold" style={{ color: "#cbd5e1" }}>{jobCount}</span> jobs
                </p>
                {/* "Clear Filters" button — only visible when filters are active */}
                {hasFilters && (
                    <button
                        onClick={onClear} // Reset all filters
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