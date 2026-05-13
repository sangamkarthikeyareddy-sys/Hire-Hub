import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHireHubAuth } from "../../context/AuthContext";
import { Briefcase, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";

export default function Navbar() {
    const { user, isLoggedIn, logout } = useHireHubAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                    <span className="text-xl font-bold text-blue-600">HireHub</span>
                </Link>

                <div className="flex items-center gap-6">
                    {isLoggedIn && (
                        <>
                            <Link
                                to="/"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Home
                            </Link>
                            <button
                                onClick={() => navigate("/jobs")}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Jobs
                            </button>
                        </>
                    )}

                    {isLoggedIn && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                                    {user.avatar}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg px-5 py-2.5 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}