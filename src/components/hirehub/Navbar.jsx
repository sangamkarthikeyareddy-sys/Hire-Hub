// ─── Navbar.jsx ─────────────────────────────────────────────
// This is the top navigation bar that appears on every page.
// It shows the HireHub logo, navigation links, and user menu.
// Features:
//   - Active page indicator (gradient underline)
//   - User dropdown with profile info, dashboard link, admin link, logout
//   - Mobile hamburger menu for small screens
//   - Sticky positioning with backdrop blur

// Import React and hooks for state, refs, and side effects
import React, { useState, useRef, useEffect } from "react";
// Import routing tools for links, navigation, and current path detection
import { Link, useNavigate, useLocation } from "react-router-dom";
// Import auth hook to get user data and login/logout state
import { useHireHubAuth } from "../../context/AuthContext";
// Import icons used in the navbar
import { Briefcase, ChevronDown, LogOut, LayoutDashboard, Shield, Menu, X } from "lucide-react";

// ─── Navbar Component ───────────────────────────────────────
export default function Navbar() {
    // Get user data, login status, and logout function from auth context
    const { user, isLoggedIn, logout } = useHireHubAuth();
    // Track whether the desktop user dropdown is open
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Track whether the mobile hamburger menu is open
    const [mobileOpen, setMobileOpen] = useState(false);
    // Ref for the dropdown — used to detect clicks outside and close it
    const dropdownRef = useRef(null);
    // Navigation function to redirect after logout
    const navigate = useNavigate();
    // Get the current URL path to highlight the active nav link
    const location = useLocation();

    // ── Close dropdown when clicking outside of it ──
    useEffect(() => {
        const handler = (e) => {
            // If the click is outside the dropdown, close it
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        // Cleanup: remove the event listener when the component unmounts
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Close mobile menu when navigating to a new page ──
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]); // Runs whenever the URL changes

    // ── Handle logout: clear session, close menus, redirect ──
    const handleLogout = () => {
        logout();                // Clear auth state and cookie
        setDropdownOpen(false);  // Close desktop dropdown
        setMobileOpen(false);    // Close mobile menu
        navigate("/login");      // Redirect to login page
    };

    // ── Check if a given path matches the current URL ──
    const isActivePath = (path) => location.pathname === path;

    // ── Style for nav links: white when active, gray when inactive ──
    const navLinkStyle = (path) => ({
        color: isActivePath(path) ? "#e2e8f0" : "#94a3b8",
        position: "relative", // Needed for the active underline indicator
    });

    return (
        // Sticky navbar — stays at the top when scrolling
        // Uses backdrop blur for a glass-like effect
        <nav className="sticky top-0 z-50" style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* ── Logo (links to home) ── */}
                <Link to="/" className="flex items-center gap-2 group">
                    {/* Gradient icon container with hover scale effect */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">HireHub</span>
                </Link>

                {/* ═══════════════════════════════════════════ */}
                {/* ── Desktop Navigation Links ─────────────── */}
                {/* ═══════════════════════════════════════════ */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Show nav links only when logged in */}
                    {isLoggedIn && (
                        <>
                            {/* Home link */}
                            <Link
                                to="/"
                                className="text-sm font-medium transition-colors duration-200 hover:text-white"
                                style={navLinkStyle("/")}
                            >
                                Home
                                {/* Active page indicator — gradient underline */}
                                {isActivePath("/") && (
                                    <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 rounded-full"
                                        style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                                )}
                            </Link>
                            {/* Jobs link */}
                            <Link
                                to="/jobs"
                                className="text-sm font-medium transition-colors duration-200 hover:text-white"
                                style={navLinkStyle("/jobs")}
                            >
                                Jobs
                                {isActivePath("/jobs") && (
                                    <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 rounded-full"
                                        style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                                )}
                            </Link>
                        </>
                    )}

                    {/* ── User Menu (logged in) or Sign In button (logged out) ── */}
                    {isLoggedIn && user ? (
                        // Desktop user dropdown
                        <div className="relative" ref={dropdownRef}>
                            {/* Dropdown trigger button — shows avatar, name, and chevron */}
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200"
                                style={{ color: "#cbd5e1" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = "transparent"; }}
                            >
                                {/* User avatar with gradient background */}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                                    {user.avatar} {/* Shows initials like "AS" */}
                                </div>
                                {/* User name — hidden on small screens */}
                                <span className="text-sm font-medium hidden sm:block" style={{ color: "#cbd5e1" }}>
                                    {user.name}
                                </span>
                                {/* Chevron arrow — rotates when dropdown is open */}
                                <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ color: "#64748b", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }} />
                            </button>

                            {/* ── Dropdown Menu ── */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl py-2"
                                    style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                                    {/* User info header */}
                                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{user.email}</p>
                                        {/* Role badge */}
                                        <span className="inline-block text-[10px] font-medium mt-1.5 px-2 py-0.5 rounded-full capitalize"
                                            style={{ background: user.role === "admin" ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.15)", color: user.role === "admin" ? "#a78bfa" : "#60a5fa" }}>
                                            {user.role}
                                        </span>
                                    </div>
                                    {/* Dashboard link */}
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                                        style={{ color: "#94a3b8" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e2e8f0"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    {/* Admin Panel link — only visible to admins */}
                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                                            style={{ color: "#94a3b8" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e2e8f0"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                        >
                                            <Shield className="w-4 h-4" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    {/* Divider line */}
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 0" }} />
                                    {/* Sign Out button — red text */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors"
                                        style={{ color: "#f87171" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // ── "Sign In" button for logged-out users ──
                        <Link
                            to="/login"
                            className="text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* ═══════════════════════════════════════════ */}
                {/* ── Mobile Hamburger Button ─────────────── */}
                {/* ═══════════════════════════════════════════ */}
                {/* Only visible on small screens (below md breakpoint) */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                >
                    {/* Toggle between hamburger (☰) and close (✕) icons */}
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* ── Mobile Menu (slides down below navbar) ─ */}
            {/* ═══════════════════════════════════════════ */}
            {mobileOpen && (
                <div className="md:hidden px-4 pb-5 space-y-2"
                    style={{ background: "rgba(11,15,26,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {isLoggedIn && user ? (
                        <>
                            {/* User info card at the top of mobile menu */}
                            <div className="flex items-center gap-3 py-3 px-4 rounded-xl mb-2"
                                style={{ background: "rgba(255,255,255,0.04)" }}>
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))", color: "#a5b4fc" }}>
                                    {user.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <p className="text-xs" style={{ color: "#64748b" }}>{user.email}</p>
                                </div>
                            </div>

                            {/* Mobile nav links — Home, Jobs, Dashboard, Admin Panel */}
                            {[
                                { to: "/", label: "Home" },
                                { to: "/jobs", label: "Jobs" },
                                { to: "/dashboard", label: "Dashboard" },
                                // Only add Admin Panel link if user is an admin
                                ...(user.role === "admin" ? [{ to: "/admin", label: "Admin Panel" }] : []),
                            ].map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                                    style={{
                                        color: isActivePath(link.to) ? "#e2e8f0" : "#94a3b8",
                                        // Highlight the active page with a blue background tint
                                        background: isActivePath(link.to) ? "rgba(59,130,246,0.1)" : "transparent"
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Mobile Sign Out button */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors mt-2"
                                style={{ color: "#f87171", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        // ── Mobile "Sign In" button for logged-out users ──
                        <Link
                            to="/login"
                            className="block text-center text-white text-sm font-medium rounded-xl px-5 py-3 transition-all"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}