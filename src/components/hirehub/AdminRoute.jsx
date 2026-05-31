// ─── AdminRoute.jsx ─────────────────────────────────────────
// This component guards routes that require ADMIN access.
// It checks two things:
//   1. Is the user logged in?
//   2. Does the user have the "admin" role?
// If not, they get redirected to the appropriate page.

// Import React library
import React from "react";
// Import Navigate for redirecting unauthorized users
import { Navigate } from "react-router-dom";
// Import auth hook to check user role
import { useHireHubAuth } from "../../context/AuthContext";

// ─── AdminRoute Component ───────────────────────────────────
// Usage: <AdminRoute><Admin /></AdminRoute>
// Only allows access if the user is logged in AND has role === "admin"
export default function AdminRoute({ children }) {
    // Get the user object, login status, and loading state
    const { user, isLoggedIn, loading } = useHireHubAuth();

    // ── Still checking auth? Show loading spinner ──
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0b0f1a" }}>
                {/* Blue spinning circle */}
                <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3b82f6" }} />
            </div>
        );
    }

    // ── Not logged in? Redirect to login page ──
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // ── Logged in but NOT an admin? Redirect to regular dashboard ──
    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    // ── User is logged in AND is an admin! Show the admin page ──
    return children;
}