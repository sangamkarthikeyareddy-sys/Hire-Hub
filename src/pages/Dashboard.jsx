// ─── Dashboard.jsx ──────────────────────────────────────────
// This is the user's personal dashboard page.
// It shows a personalized greeting, quick actions,
// profile info, stats, and bookmarked/saved jobs.

// Import React library
import React from "react";
// Import navigation hook to redirect users to other pages
import { useNavigate } from "react-router-dom";
// Import auth hook to get the current user and logout function
import { useHireHubAuth } from "../context/AuthContext";
// Import icons used in the dashboard UI
import { LogOut, Briefcase, ArrowRight, Sparkles, Clock } from "lucide-react";
// Import dashboard sub-components
import ProfileCard from "../components/hirehub/ProfileCard";       // Shows user profile info
import StatsRow from "../components/hirehub/StatsRow";             // Shows stats (bookmarks, jobs browsed)
import BookmarkedJobs from "../components/hirehub/BookmarkedJobs"; // Shows list of saved jobs

// ─── Dashboard Page Component ───────────────────────────────
export default function Dashboard() {
    // Get the logout function and current user from auth context
    const { logout, user } = useHireHubAuth();
    // Navigation function to redirect to other pages
    const navigate = useNavigate();

    // ── Handle logout button click ──
    // Clears the user session and redirects to the login page
    const handleLogout = () => {
        logout();            // Clear auth state and remove cookie
        navigate("/login");  // Redirect to login page
    };

    // ── Determine time-based greeting ──
    // Shows "Good morning", "Good afternoon", or "Good evening" based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        // Main container — takes up at least the full viewport height minus the navbar
        <div className="relative" style={{ minHeight: "calc(100vh - 64px)" }}>

            {/* ── Decorative background glow effects ── */}
            {/* These colored circles create a subtle ambient lighting effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Blue glow on the left side */}
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                {/* Purple glow on the right side */}
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
            </div>

            {/* ── Content container (centered, max width) ── */}
            <div className="relative max-w-7xl mx-auto px-4 py-8">

                {/* ═══════════════════════════════════════════ */}
                {/* ── Welcome Header Banner ────────────────── */}
                {/* ═══════════════════════════════════════════ */}
                <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>

                    {/* Decorative glowing orbs inside the banner */}
                    <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full opacity-15"
                        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />

                    {/* Subtle grid pattern overlay for depth */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                    {/* Banner content: greeting on left, date + logout on right */}
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left side: greeting and subtitle */}
                        <div>
                            {/* "My Dashboard" badge */}
                            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-3"
                                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>
                                <Sparkles className="w-3 h-3" />
                                My Dashboard
                            </div>
                            {/* Personalized greeting with user's first name */}
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                {greeting}, <span className="text-transparent bg-clip-text"
                                    style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>
                                    {user?.name?.split(" ")[0] || "there"} {/* Show first name or "there" if no name */}
                                </span>
                            </h1>
                            {/* Subtitle text */}
                            <p className="mt-1.5 text-sm" style={{ color: "#94a3b8" }}>
                                Here's a summary of your job search progress.
                            </p>
                        </div>

                        {/* Right side: date display + logout button */}
                        <div className="flex items-center gap-3">
                            {/* Current date — hidden on mobile to save space */}
                            <div className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
                                <Clock className="w-4 h-4" />
                                {/* Format: "Wednesday, May 20" */}
                                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                            </div>
                            {/* Logout button — turns red on hover */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════ */}
                {/* ── Quick Action Banner (Browse Jobs CTA) ─ */}
                {/* ═══════════════════════════════════════════ */}
                {/* A call-to-action encouraging users to browse available jobs */}
                <div className="rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div className="flex items-center gap-3">
                        {/* Briefcase icon with gradient background */}
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">Ready to find your next role?</p>
                            <p className="text-xs" style={{ color: "#64748b" }}>Discover fresh opportunities from top companies</p>
                        </div>
                    </div>
                    {/* "Browse Jobs" button — navigates to the jobs listing page */}
                    <button
                        onClick={() => navigate("/jobs")}
                        className="inline-flex items-center gap-2 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 whitespace-nowrap"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                    >
                        Browse Jobs
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* ═══════════════════════════════════════════ */}
                {/* ── Main Dashboard Content ─────────────── */}
                {/* ═══════════════════════════════════════════ */}
                <div className="space-y-6">
                    <ProfileCard />     {/* User's profile card (name, email, bio, location) */}
                    <StatsRow />        {/* Statistics row (total bookmarks, jobs browsed, member since) */}
                    <BookmarkedJobs />  {/* List of jobs the user has saved/bookmarked */}
                </div>
            </div>
        </div>
    );
}