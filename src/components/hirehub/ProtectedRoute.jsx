import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useHireHubAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useHireHubAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isLoggedIn) {
        const redirectPath = location.pathname + location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    return children;
}