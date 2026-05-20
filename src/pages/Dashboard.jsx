import React from "react";
import { useNavigate } from "react-router-dom";
import { useHireHubAuth } from "../context/AuthContext";
import { LogOut, Briefcase, ArrowRight, Sparkles, Clock } from "lucide-react";
import ProfileCard from "../components/hirehub/ProfileCard";
import StatsRow from "../components/hirehub/StatsRow";
import BookmarkedJobs from "../components/hirehub/BookmarkedJobs";

export default function Dashboard() {
    const { logout, user } = useHireHubAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="relative" style={{ minHeight: "calc(100vh - 64px)" }}>
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Header */}
                <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>

                    {/* Decorative orbs */}
                    <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full opacity-15"
                        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />

                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-3"
                                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>
                                <Sparkles className="w-3 h-3" />
                                My Dashboard
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                {greeting}, <span className="text-transparent bg-clip-text"
                                    style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>
                                    {user?.name?.split(" ")[0] || "there"}
                                </span>
                            </h1>
                            <p className="mt-1.5 text-sm" style={{ color: "#94a3b8" }}>
                                Here's a summary of your job search progress.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
                                <Clock className="w-4 h-4" />
                                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                            </div>
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

                {/* Quick Action Banner */}
                <div className="rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">Ready to find your next role?</p>
                            <p className="text-xs" style={{ color: "#64748b" }}>Discover fresh opportunities from top companies</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="inline-flex items-center gap-2 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 whitespace-nowrap"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                    >
                        Browse Jobs
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <ProfileCard />
                    <StatsRow />
                    <BookmarkedJobs />
                </div>
            </div>
        </div>
    );
}