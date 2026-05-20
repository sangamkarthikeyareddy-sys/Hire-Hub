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
            color: "#f472b6",
            bg: "rgba(236,72,153,0.12)",
        },
        {
            label: "Jobs Browsed",
            value: jobsBrowsed,
            icon: Eye,
            color: "#60a5fa",
            bg: "rgba(59,130,246,0.12)",
        },
        {
            label: "Member Since",
            value: user?.joinedDate || "—",
            icon: Calendar,
            color: "#34d399",
            bg: "rgba(16,185,129,0.12)",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-xl p-5 flex items-center gap-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center"
                        style={{ background: stat.bg }}
                    >
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: "#64748b" }}>{stat.label}</p>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}