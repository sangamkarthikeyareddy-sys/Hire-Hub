import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout and components
import AppLayout from "./components/hirehub/AppLayout";
import ProtectedRoute from "./components/hirehub/ProtectedRoute";
import AdminRoute from "./components/hirehub/AdminRoute";

// Pages
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { useHireHubAuth } from "./context/AuthContext";

/* ─── Smart Home Route: admin → AdminHome, user → Home ─── */
function SmartHome() {
    const { user, isLoggedIn } = useHireHubAuth();
    if (isLoggedIn && user?.role === "admin") {
        return <AdminHome />;
    }
    return <Home />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    {/* Public Routes — admin sees AdminHome, users see landing */}
                    <Route path="/" element={<SmartHome />} />
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected Routes - require login */}
                    <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                    <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />

                    {/* Protected Candidate Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Protected Routes */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Admin />
                            </AdminRoute>
                        }
                    />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
