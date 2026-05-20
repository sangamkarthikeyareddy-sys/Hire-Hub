import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowRight } from "lucide-react";
import { useBookmarks } from "../../context/BookmarkContext";
import JobCard from "./JobCard";

export default function BookmarkedJobs() {
    const { bookmarks } = useBookmarks();

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">
                Saved Jobs ({bookmarks.length})
            </h3>

            {bookmarks.length === 0 ? (
                <div className="rounded-xl p-12 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Bookmark className="w-10 h-10 mx-auto mb-3" style={{ color: "#334155" }} />
                    <p className="font-medium" style={{ color: "#64748b" }}>No saved jobs yet</p>
                    <p className="text-sm mt-1" style={{ color: "#475569" }}>
                        Browse jobs and save the ones you like
                    </p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-1.5 mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                        Browse Jobs
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookmarks.map((job) => (
                        <JobCard key={job.id} job={job} showRemove />
                    ))}
                </div>
            )}
        </div>
    );
}