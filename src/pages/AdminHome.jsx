// ─── AdminHome.jsx ──────────────────────────────────────────
// This is the admin's personalized home page (shown instead of the public landing page).
// It displays an analytics dashboard with:
//   - Welcome banner with admin greeting
//   - Key metrics (total jobs, active users, applications, approval rate)
//   - Recent activity feed
//   - Quick action buttons (Post Job, Manage Users, etc.)
//   - Performance charts and platform health overview
// Only visible to users with role "admin" via the SmartHome component in App.jsx.

// Import React and hooks for state, effects, and refs
import React, { useState, useEffect, useRef } from "react";
// Import navigation hook for redirecting
import { useNavigate } from "react-router-dom";
// Import all icons used across the admin dashboard
import {
    Shield, Users, Briefcase, TrendingUp, Plus, Settings,
    BarChart3, Activity, Clock, ArrowUpRight, ArrowDownRight,
    FileText, Bell, Eye, CheckCircle2, AlertTriangle,
    Layers, Globe, Zap, ChevronRight, Sparkles,
    UserCheck, UserPlus, DollarSign, PieChart
} from "lucide-react";
import { useHireHubAuth } from "../context/AuthContext";

/* ─── Animated counter hook ──────────────────────────────── */
function useCounter(target, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const tick = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

/* ─── Data ───────────────────────────────────────────────── */
const PLATFORM_STATS = [
    { label: "Total Jobs", value: 10240, icon: Briefcase, change: "+12%", up: true, gradient: "linear-gradient(135deg, #3b82f6, #6366f1)" },
    { label: "Active Users", value: 52400, icon: Users, change: "+8%", up: true, gradient: "linear-gradient(135deg, #10b981, #059669)" },
    { label: "Applications", value: 34800, icon: FileText, change: "+23%", up: true, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { label: "Hiring Rate", value: 94, suffix: "%", icon: TrendingUp, change: "+3%", up: true, gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
];

const QUICK_ACTIONS = [
    { label: "Post New Job", icon: Plus, path: "/admin", gradient: "linear-gradient(135deg, #3b82f6, #6366f1)", desc: "Create a new job listing" },
    { label: "Manage Jobs", icon: Layers, path: "/admin", gradient: "linear-gradient(135deg, #10b981, #059669)", desc: "Edit or remove listings" },
    { label: "View Jobs", icon: Eye, path: "/jobs", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", desc: "Browse all job listings" },
    { label: "Platform Stats", icon: BarChart3, path: "/admin", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)", desc: "Detailed analytics" },
];

const RECENT_ACTIVITY = [
    { icon: UserPlus, text: "New user registered: Sarah Chen", time: "2 min ago", color: "#10b981" },
    { icon: Briefcase, text: "Job posted: Senior React Dev at TechCorp", time: "15 min ago", color: "#3b82f6" },
    { icon: UserCheck, text: "Application approved: Carlos for DevOps role", time: "1 hr ago", color: "#8b5cf6" },
    { icon: AlertTriangle, text: "Job listing flagged for review: #4521", time: "2 hrs ago", color: "#f59e0b" },
    { icon: CheckCircle2, text: "Company verified: InnovateTech Solutions", time: "3 hrs ago", color: "#10b981" },
    { icon: FileText, text: "12 new applications received today", time: "4 hrs ago", color: "#6366f1" },
];

const CATEGORY_BREAKDOWN = [
    { name: "Software Dev", percentage: 35, color: "#3b82f6", count: 3584 },
    { name: "Design", percentage: 15, color: "#ec4899", count: 1536 },
    { name: "Marketing", percentage: 12, color: "#f59e0b", count: 1229 },
    { name: "Data & AI", percentage: 18, color: "#10b981", count: 1843 },
    { name: "Product", percentage: 10, color: "#8b5cf6", count: 1024 },
    { name: "Other", percentage: 10, color: "#64748b", count: 1024 },
];

const SYSTEM_HEALTH = [
    { label: "API Response", value: "45ms", status: "healthy", icon: Zap },
    { label: "Server Uptime", value: "99.98%", status: "healthy", icon: Activity },
    { label: "Database Load", value: "23%", status: "healthy", icon: BarChart3 },
    { label: "CDN Status", value: "Active", status: "healthy", icon: Globe },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/* ─── Admin Hero / Welcome ───────────────────────────────── */
function AdminHero() {
    const { user } = useHireHubAuth();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <section className="relative overflow-hidden rounded-3xl" style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
        }}>
            {/* Glowing orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)", animation: "pulse 4s ease-in-out infinite" }} />
            <div className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", animation: "pulse 5s ease-in-out infinite 1s" }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="relative px-8 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-4"
                        style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                        <Shield className="w-3.5 h-3.5" />
                        Admin Dashboard
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                        {greeting}, <span className="text-transparent bg-clip-text" style={{
                            backgroundImage: "linear-gradient(135deg, #a78bfa, #60a5fa)"
                        }}>{user?.name?.split(" ")[0] || "Admin"}</span>
                    </h1>
                    <p className="mt-2 text-base" style={{ color: "#94a3b8" }}>
                        Here's what's happening on your platform today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
                        <Clock className="w-4 h-4" />
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Platform Stats Cards ───────────────────────────────── */
function PlatformStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLATFORM_STATS.map((stat) => {
                const counter = useCounter(stat.value);
                return (
                    <div key={stat.label} ref={counter.ref}
                        className="relative group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                        {/* Decorative gradient stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: stat.gradient }} />

                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: stat.gradient }}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1`}
                                style={{ background: stat.up ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: stat.up ? "#34d399" : "#f87171" }}>
                                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-white">
                            {counter.count.toLocaleString()}{stat.suffix || ""}
                        </p>
                        <p className="text-sm mt-1 font-medium" style={{ color: "#64748b" }}>{stat.label}</p>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Quick Actions ──────────────────────────────────────── */
function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {QUICK_ACTIONS.map((action) => (
                    <button key={action.label}
                        onClick={() => navigate(action.path)}
                        className="group text-left rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                            style={{ background: action.gradient }}>
                            <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-semibold text-white text-sm">{action.label}</p>
                        <p className="text-xs mt-1" style={{ color: "#64748b" }}>{action.desc}</p>
                        <ChevronRight className="w-4 h-4 mt-2 transition-all group-hover:translate-x-1" style={{ color: "#475569" }} />
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Recent Activity ────────────────────────────────────── */
function RecentActivity() {
    return (
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Recent Activity
            </h2>
            <div className="space-y-1">
                {RECENT_ACTIVITY.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-xl px-4 py-3.5 transition-colors"
                        style={{ cursor: "default" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `${item.color}20` }}>
                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium" style={{ color: "#cbd5e1" }}>{item.text}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Category Breakdown ─────────────────────────────────── */
function CategoryBreakdown() {
    return (
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-400" />
                Jobs by Category
            </h2>
            <div className="space-y-4">
                {CATEGORY_BREAKDOWN.map((cat) => (
                    <div key={cat.name}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium" style={{ color: "#cbd5e1" }}>{cat.name}</span>
                            <span className="text-xs" style={{ color: "#64748b" }}>{cat.count.toLocaleString()} jobs ({cat.percentage}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${cat.percentage}%`, background: cat.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── System Health ──────────────────────────────────────── */
function SystemHealth() {
    return (
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                System Health
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {SYSTEM_HEALTH.map((item) => (
                    <div key={item.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between mb-2">
                            <item.icon className="w-4 h-4" style={{ color: "#64748b" }} />
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" style={{
                                    animation: "pulse 2s ease-in-out infinite"
                                }} />
                                <span className="text-xs font-medium capitalize" style={{ color: "#34d399" }}>{item.status}</span>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-white">{item.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Platform Overview Mini Chart ───────────────────────── */
function PlatformOverview() {
    const navigate = useNavigate();
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = [65, 80, 45, 90, 70, 55, 85]; // mock data

    return (
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Weekly Applications
                </h2>
                <span className="text-xs font-medium" style={{ color: "#64748b" }}>Last 7 days</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-40 px-2">
                {data.map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>{val}</span>
                        <div className="w-full rounded-lg transition-all duration-500 hover:opacity-80"
                            style={{
                                height: `${val}%`,
                                background: i === data.indexOf(Math.max(...data))
                                    ? "linear-gradient(180deg, #3b82f6, #6366f1)"
                                    : "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
                                minHeight: "8px"
                            }} />
                        <span className="text-xs" style={{ color: "#64748b" }}>{weekDays[i]}</span>
                    </div>
                ))}
            </div>
            <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                    <p className="text-2xl font-extrabold text-white">490</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>Total this week</p>
                </div>
                <button onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function AdminHome() {
    return (
        <div className="relative" style={{ background: "#0b0f1a", minHeight: "100vh" }}>
            {/* Ambient background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.07]"
                    style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
                <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
            </div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

            <div className="relative max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Welcome Hero */}
                <AdminHero />

                {/* Platform Stats */}
                <PlatformStats />

                {/* Quick Actions */}
                <QuickActions />

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left: wider */}
                    <div className="lg:col-span-3 space-y-6">
                        <PlatformOverview />
                        <RecentActivity />
                    </div>
                    {/* Right: narrower */}
                    <div className="lg:col-span-2 space-y-6">
                        <CategoryBreakdown />
                        <SystemHealth />
                    </div>
                </div>
            </div>

            {/* Pulse animation keyframes */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}
