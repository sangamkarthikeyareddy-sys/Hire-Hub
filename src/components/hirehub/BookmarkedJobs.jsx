// ─── BookmarkedJobs.jsx ─────────────────────────────────────
// This component displays the user's saved/bookmarked jobs on their dashboard.
// If they haven't saved any jobs yet, it shows a friendly empty state
// with a link to browse available jobs.

// Import React library
import React from "react";
// Import Link component for navigation
import { Link } from "react-router-dom";
// Import icons used in the empty state
import { Bookmark, ArrowRight } from "lucide-react";
// Import bookmark context to get the saved jobs list
import { useBookmarks } from "../../context/BookmarkContext";
// Import JobCard component to render each saved job
import JobCard from "./JobCard";

// ─── BookmarkedJobs Component ───────────────────────────────
export default function BookmarkedJobs() {
    // Get the array of bookmarked jobs from context
    const { bookmarks } = useBookmarks();

    return (
        <div>
            {/* Section title with count of saved jobs */}
            <h3 className="text-lg font-semibold text-white mb-4">
                Saved Jobs ({bookmarks.length})
            </h3>

            {bookmarks.length === 0 ? (
                // ── Empty state: no jobs saved yet ──
                // Shows a placeholder message and a link to browse jobs
                <div className="rounded-xl p-12 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Bookmark icon */}
                    <Bookmark className="w-10 h-10 mx-auto mb-3" style={{ color: "#334155" }} />
                    <p className="font-medium" style={{ color: "#64748b" }}>No saved jobs yet</p>
                    <p className="text-sm mt-1" style={{ color: "#475569" }}>
                        Browse jobs and save the ones you like
                    </p>
                    {/* Link to the jobs page */}
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-1.5 mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                        Browse Jobs
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                // ── Saved jobs grid ──
                // Responsive: 1 column on mobile, 2 on tablet, 3 on desktop
                // "showRemove" prop tells JobCard to show a remove/unsave button
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookmarks.map((job) => (
                        <JobCard key={job.id} job={job} showRemove />
                    ))}
                </div>
            )}
        </div>
    );
}