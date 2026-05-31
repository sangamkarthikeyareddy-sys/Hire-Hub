// Import React library for building UI components
import React from "react";
// Import React Router tools for navigation and routing
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ─── Layout and Shared Components ───────────────────────────
// AppLayout wraps every page with the Navbar on top and Footer at the bottom
import AppLayout from "./components/hirehub/AppLayout";
// ProtectedRoute blocks access to pages unless the user is logged in
import ProtectedRoute from "./components/hirehub/ProtectedRoute";
// AdminRoute blocks access unless the user is logged in AND has the "admin" role
import AdminRoute from "./components/hirehub/AdminRoute";

// ─── Page Components ────────────────────────────────────────
import Home from "./pages/Home";           // Public landing page for regular users
import AdminHome from "./pages/AdminHome"; // Admin dashboard home (analytics & stats)
import Jobs from "./pages/Jobs";           // Job listing page with filters & search
import JobDetail from "./pages/JobDetail"; // Single job detail view
import SignIn from "./pages/SignIn";       // Login page
import SignUp from "./pages/SignUp";       // Registration / create account page
import Dashboard from "./pages/Dashboard"; // User dashboard (profile, bookmarks, stats)
import Admin from "./pages/Admin";         // Admin panel (post jobs, manage listings)
// Import the auth hook to check if the user is logged in and their role
import { useHireHubAuth } from "./context/AuthContext";

/* ─── SmartHome: Shows a different homepage based on user role ─── */
// If the user is an admin, they see the AdminHome with analytics.
// Everyone else (logged in or not) sees the regular public Home page.
function SmartHome() {
    const { user, isLoggedIn } = useHireHubAuth(); // Get current user info
    if (isLoggedIn && user?.role === "admin") {
        return <AdminHome />; // Admin sees their dashboard
    }
    return <Home />; // Regular users/guests see the landing page
}

// ─── Main App Component ─────────────────────────────────────
// This is the root component that sets up all the routes (pages) of the app.
export default function App() {
    return (
        // BrowserRouter enables client-side navigation (no full page reloads)
        <BrowserRouter>
            <Routes>
                {/* All routes inside AppLayout get the shared Navbar + Footer */}
                <Route element={<AppLayout />}>
                    {/* ── Public Routes (anyone can access) ───────── */}
                    <Route path="/" element={<SmartHome />} />      {/* Home page */}
                    <Route path="/login" element={<SignIn />} />     {/* Sign in page */}
                    <Route path="/signup" element={<SignUp />} />    {/* Sign up page */}

                    {/* ── Protected Routes (must be logged in) ───── */}
                    <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                    <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />

                    {/* ── User Dashboard (must be logged in) ─────── */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* ── Admin Panel (must be logged in + admin role) */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Admin />
                            </AdminRoute>
                        }
                    />
                </Route>

                {/* ── Fallback: any unknown URL redirects to home ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
