import React from "react";
import { Heart, Eye, Calendar } from "lucide-react";
import { useBookmarks } from "../../context/BookmarkContext";
import { useHireHubAuth } from "../../context/AuthContext";

export default function StatsRow() {
    const { bookmarks } = useBookmarks();
    const { user } = useHireHubAuth();
    const jobsBrowsed = parseInt(
        localStorage.getItem("hirehub_jobs_browsed") || "0",
        10
    );

    const stats = [
        {
            label: "Total Bookmarks",
            value: bookmarks.length,
            icon: Heart,
            color: "text-pink-500",
            bg: "bg-pink-50",
        },
        {
            label: "Jobs Browsed",
            value: jobsBrowsed,
            icon: Eye,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "Member Since",
            value: user?.joinedDate || "—",
            icon: Calendar,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4"
                >
                    <div
                        className={`w-11 h-11 rounded-lg ${stat.bg} flex items-center justify-center`}
                    >
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}