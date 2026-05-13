import React from "react";
import { Navigate } from "react-router-dom";
import { useHireHubAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, isLoggedIn, loading } = useHireHubAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}