import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHireHubAuth } from "../../context/AuthContext";
import { Briefcase, ChevronDown, LogOut, LayoutDashboard, Shield, Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, isLoggedIn, logout } = useHireHubAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMobileOpen(false);
        navigate("/login");
    };

    const isActivePath = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        color: isActivePath(path) ? "#e2e8f0" : "#94a3b8",
        position: "relative",
    });

    return (
        <nav className="sticky top-0 z-50" style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">HireHub</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-6">
                    {isLoggedIn && (
                        <>
                            <Link
                                to="/"
                                className="text-sm font-medium transition-colors duration-200 hover:text-white"
                                style={navLinkStyle("/")}
                            >
                                Home
                                {isActivePath("/") && (
                                    <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 rounded-full"
                                        style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                                )}
                            </Link>
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

                    {isLoggedIn && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200"
                                style={{ color: "#cbd5e1" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                                    {user.avatar}
                                </div>
                                <span className="text-sm font-medium hidden sm:block" style={{ color: "#cbd5e1" }}>
                                    {user.name}
                                </span>
                                <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ color: "#64748b", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl py-2"
                                    style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{user.email}</p>
                                        <span className="inline-block text-[10px] font-medium mt-1.5 px-2 py-0.5 rounded-full capitalize"
                                            style={{ background: user.role === "admin" ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.15)", color: user.role === "admin" ? "#a78bfa" : "#60a5fa" }}>
                                            {user.role}
                                        </span>
                                    </div>
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
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 0" }} />
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
                        <Link
                            to="/login"
                            className="text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden px-4 pb-5 space-y-2"
                    style={{ background: "rgba(11,15,26,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {isLoggedIn && user ? (
                        <>
                            {/* User info */}
                            <div className="flex items-center gap-3 py-3 px-4 rounded-xl mb-2"
                                style={{ background: "rgba(255,255,255,0.04)" }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))", color: "#a5b4fc" }}>
                                    {user.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <p className="text-xs" style={{ color: "#64748b" }}>{user.email}</p>
                                </div>
                            </div>

                            {[
                                { to: "/", label: "Home" },
                                { to: "/jobs", label: "Jobs" },
                                { to: "/dashboard", label: "Dashboard" },
                                ...(user.role === "admin" ? [{ to: "/admin", label: "Admin Panel" }] : []),
                            ].map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                                    style={{
                                        color: isActivePath(link.to) ? "#e2e8f0" : "#94a3b8",
                                        background: isActivePath(link.to) ? "rgba(59,130,246,0.1)" : "transparent"
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}

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