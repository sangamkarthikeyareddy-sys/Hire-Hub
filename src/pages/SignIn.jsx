// ─── SignIn.jsx ──────────────────────────────────────────────
// This is the login page. It has a split-panel design:
// Left side = branding & features, Right side = login form.
// After login, users are redirected to their dashboard (or admin panel for admins).

// Import React and hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import routing tools: navigate between pages, read URL params, create links
import { useNavigate, useSearchParams, Link } from "react-router-dom";
// Import auth hook for login functionality
import { useHireHubAuth } from "../context/AuthContext";
// Import icons used in the UI
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

// ─── SignIn Page Component ──────────────────────────────────
export default function SignIn() {
    // Get login function and current auth state from context
    const { login, isLoggedIn, user } = useHireHubAuth();
    // Navigation function to redirect after login
    const navigate = useNavigate();
    // Read URL query parameters (e.g., ?redirect=/jobs)
    const [searchParams] = useSearchParams();
    // If user came from a protected page, redirect back there after login
    const redirectTo = searchParams.get("redirect");

    // ── Form State ──
    const [email, setEmail] = useState("");         // Email input value
    const [password, setPassword] = useState("");   // Password input value
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [error, setError] = useState("");          // Error message to display
    const [loading, setLoading] = useState(false);   // Is the login request in progress?
    const [focused, setFocused] = useState(null);    // Which input is currently focused

    // ── Auto-redirect if already logged in ──
    // If the user is already logged in, send them to the right page
    useEffect(() => {
        if (isLoggedIn && user) {
            // Admins go to /admin, regular users go to /dashboard
            navigate(redirectTo || (user.role === "admin" ? "/admin" : "/dashboard"), { replace: true });
        }
    }, [isLoggedIn, user, navigate, redirectTo]);

    // ── Handle form submission (login attempt) ──
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page reload on form submit
        setError("");        // Clear any previous error
        setLoading(true);    // Show loading spinner

        // Small delay (500ms) for a smoother loading feel
        setTimeout(async () => {
            // Attempt to log in with the entered email and password
            const result = await login(email, password);
            setLoading(false); // Hide loading spinner

            if (result.success) {
                // Login successful — redirect to dashboard or the original page
                navigate(redirectTo || "/dashboard");
            } else {
                // Login failed — show the error message
                setError(result.error);
            }
        }, 500);
    };

    // ── Feature bullets shown on the left panel ──
    const features = [
        { icon: Zap, text: "Instant access to 10,000+ jobs" },
        { icon: Shield, text: "Verified companies only" },
        { icon: Sparkles, text: "AI-powered job matching" },
    ];

    return (
        // Full-height container centered on screen
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">

            {/* ── Decorative background glow effects ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Blue glow on the left */}
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.08]"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                {/* Purple glow on the right */}
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.06]"
                    style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
            </div>

            {/* ── Main card: two-column layout ── */}
            <div className="relative w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>

                {/* ── Left Panel: Branding & Features (hidden on mobile) ── */}
                <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)" }}>

                    {/* Decorative glowing orbs */}
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-30"
                        style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
                    <div className="absolute bottom-10 left-0 w-32 h-32 rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />

                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                    {/* Brand heading */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <Briefcase className="w-7 h-7 text-blue-400" />
                            <span className="text-2xl font-bold text-white">HireHub</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-snug mb-3">
                            Your next career
                            <br />
                            {/* Gradient text effect */}
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: "linear-gradient(135deg, #93c5fd, #c4b5fd)" }}>
                                starts here
                            </span>
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: "#a5b4fc" }}>
                            Join thousands of professionals who've found their dream remote job through HireHub.
                        </p>
                    </div>

                    {/* Feature list with icons */}
                    <div className="relative z-10 space-y-4">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(255,255,255,0.1)" }}>
                                    <f.icon className="w-4 h-4 text-blue-300" />
                                </div>
                                <span className="text-sm font-medium" style={{ color: "#c7d2fe" }}>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Security badge at the bottom */}
                    <div className="relative z-10 flex items-center gap-2 text-xs" style={{ color: "#6366f1" }}>
                        <Shield className="w-3.5 h-3.5" />
                        <span>256-bit SSL encryption</span>
                    </div>
                </div>

                {/* ── Right Panel: Login Form ── */}
                <div className="p-8 md:p-10" style={{ backdropFilter: "blur(16px)" }}>
                    {/* Form header */}
                    <div className="text-center mb-8">
                        {/* Mobile-only logo (since left panel is hidden on mobile) */}
                        <div className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                            style={{ background: "rgba(99,102,241,0.15)" }}>
                            <Briefcase className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                        <p className="mt-1.5 text-sm" style={{ color: "#64748b" }}>
                            Sign in to access your account
                        </p>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ── Email input field ── */}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>
                                Email
                            </label>
                            <div className="relative">
                                {/* Mail icon inside the input */}
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                    style={{ color: focused === "email" ? "#60a5fa" : "#475569" }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}  // Update email state
                                    onFocus={() => setFocused("email")}         // Highlight on focus
                                    onBlur={() => setFocused(null)}             // Remove highlight on blur
                                    placeholder="you@example.com"
                                    required
                                    id="signin-email"
                                    className="w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all duration-200"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        // Blue border when focused, subtle border otherwise
                                        border: focused === "email" ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                        color: "#e2e8f0",
                                        caretColor: "#60a5fa", // Blue cursor
                                        // Glow effect when focused
                                        boxShadow: focused === "email" ? "0 0 0 3px rgba(59,130,246,0.1)" : "none"
                                    }}
                                />
                            </div>
                        </div>

                        {/* ── Password input field ── */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium" style={{ color: "#94a3b8" }}>
                                    Password
                                </label>
                                {/* Forgot password link (placeholder for now) */}
                                <button type="button" className="text-xs font-medium transition-colors hover:text-blue-300"
                                    style={{ color: "#60a5fa" }}>
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                {/* Lock icon inside the input */}
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                    style={{ color: focused === "password" ? "#60a5fa" : "#475569" }} />
                                <input
                                    type={showPassword ? "text" : "password"} // Toggle between text/password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="Enter your password"
                                    required
                                    id="signin-password"
                                    className="w-full rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none transition-all duration-200"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: focused === "password" ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                        color: "#e2e8f0",
                                        caretColor: "#60a5fa",
                                        boxShadow: focused === "password" ? "0 0 0 3px rgba(59,130,246,0.1)" : "none"
                                    }}
                                />
                                {/* Eye icon button to toggle password visibility */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                                    style={{ color: "#475569" }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" /> // Show "hide" icon when password is visible
                                    ) : (
                                        <Eye className="w-4 h-4" />     // Show "show" icon when password is hidden
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ── Error message (shown only if login fails) ── */}
                        {error && (
                            <div className="rounded-xl px-4 py-3 flex items-center gap-2"
                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                            </div>
                        )}

                        {/* ── Submit button ── */}
                        <button
                            type="submit"
                            disabled={loading} // Disabled while login is in progress
                            id="signin-submit"
                            className="w-full text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            {loading ? (
                                // Loading state: show spinner
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                // Default state: show "Sign In" with arrow
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* ── Divider: "New to HireHub?" ── */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                        <span className="text-xs font-medium" style={{ color: "#475569" }}>New to HireHub?</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>

                    {/* ── Link to sign-up page ── */}
                    <Link
                        to="/signup"
                        className="block w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#e2e8f0"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                    >
                        Create a free account
                    </Link>
                </div>
            </div>
        </div>
    );
}