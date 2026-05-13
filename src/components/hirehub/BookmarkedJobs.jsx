import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowRight } from "lucide-react";
import { useBookmarks } from "../../context/BookmarkContext";
import JobCard from "./JobCard";

export default function BookmarkedJobs() {
    const { bookmarks } = useBookmarks();

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Saved Jobs ({bookmarks.length})
            </h3>

            {bookmarks.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
                    <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No saved jobs yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Browse jobs and save the ones you like
                    </p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-1.5 mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
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