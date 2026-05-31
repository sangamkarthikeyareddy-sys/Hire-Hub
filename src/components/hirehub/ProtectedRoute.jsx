// ─── ProtectedRoute.jsx ─────────────────────────────────────
// This component guards routes that require the user to be logged in.
// If the user is NOT logged in, they get redirected to the login page.
// While checking auth status, a loading spinner is shown.

// Import React library
import React from "react";
// Import Navigate (for redirecting) and useLocation (to remember where user was going)
import { Navigate, useLocation } from "react-router-dom";
// Import auth hook to check login status
import { useHireHubAuth } from "../../context/AuthContext";

// ─── ProtectedRoute Component ───────────────────────────────
// Usage: <ProtectedRoute><Dashboard /></ProtectedRoute>
// If logged in, renders the child page. If not, redirects to /login.
export default function ProtectedRoute({ children }) {
    // Get login status and loading state from auth context
    const { isLoggedIn, loading } = useHireHubAuth();
    // Get the current URL path (to redirect back after login)
    const location = useLocation();

    // ── Still checking auth? Show loading spinner ──
    // This happens on first page load while the JWT cookie is being verified
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0b0f1a" }}>
                {/* Blue spinning circle */}
                <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3b82f6" }} />
            </div>
        );
    }

    // ── Not logged in? Redirect to login page ──
    // The current URL is saved in the ?redirect= param so the user
    // can be sent back to this page after they log in
    if (!isLoggedIn) {
        const redirectPath = location.pathname + location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    // ── Logged in! Render the protected page ──
    return children;
}