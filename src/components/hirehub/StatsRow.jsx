// ─── StatsRow.jsx ───────────────────────────────────────────
// This component shows three stat cards on the user's dashboard:
//   1. Total Bookmarks — how many jobs the user has saved
//   2. Jobs Browsed — how many job detail pages they've viewed
//   3. Member Since — when they joined HireHub

// Import React library
import React from "react";
// Import icons for each stat card
import { Heart, Eye, Calendar } from "lucide-react";
// Import bookmark context to get the number of saved jobs
import { useBookmarks } from "../../context/BookmarkContext";
// Import auth context to get the user's join date
import { useHireHubAuth } from "../../context/AuthContext";

// ─── StatsRow Component ─────────────────────────────────────
export default function StatsRow() {
    // Get the bookmarks array to count total saved jobs
    const { bookmarks } = useBookmarks();
    // Get the current user to display their join date
    const { user } = useHireHubAuth();

    // Read the "jobs browsed" counter from localStorage
    // This counter is incremented every time a user visits a job detail page
    const jobsBrowsed = parseInt(
        localStorage.getItem("hirehub_jobs_browsed") || "0",
        10
    );

    // ── Define the three stat cards ──
    const stats = [
        {
            label: "Total Bookmarks",      // Card title
            value: bookmarks.length,        // Number of saved jobs
            icon: Heart,                    // Pink heart icon
            color: "#f472b6",              // Icon color (pink)
            bg: "rgba(236,72,153,0.12)",   // Background tint
        },
        {
            label: "Jobs Browsed",          // Card title
            value: jobsBrowsed,             // Count from localStorage
            icon: Eye,                      // Blue eye icon
            color: "#60a5fa",              // Icon color (blue)
            bg: "rgba(59,130,246,0.12)",   // Background tint
        },
        {
            label: "Member Since",          // Card title
            value: user?.joinedDate || "—", // Join date or dash if unavailable
            icon: Calendar,                 // Green calendar icon
            color: "#34d399",              // Icon color (green)
            bg: "rgba(16,185,129,0.12)",   // Background tint
        },
    ];

    return (
        // Responsive grid: 1 column on mobile, 3 columns on tablet+
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
                // Each stat card
                <div
                    key={stat.label}
                    className="rounded-xl p-5 flex items-center gap-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    {/* Colored icon container */}
                    <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center"
                        style={{ background: stat.bg }}
                    >
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    {/* Label and value */}
                    <div>
                        <p className="text-sm" style={{ color: "#64748b" }}>{stat.label}</p>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}