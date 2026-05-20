import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useHireHubAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useHireHubAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0b0f1a" }}>
                <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3b82f6" }} />
            </div>
        );
    }

    if (!isLoggedIn) {
        const redirectPath = location.pathname + location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    return children;
}