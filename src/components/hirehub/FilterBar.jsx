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
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or company..."
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
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
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
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
                <p className="text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-700">{jobCount}</span> jobs
                </p>
                {hasFilters && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}