import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHireHubAuth } from "../context/AuthContext";
import {
    Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight,
    User, MapPin, Phone, Sparkles, Shield, Zap, CheckCircle2
} from "lucide-react";

export default function SignUp() {
    const { register, isLoggedIn, user } = useHireHubAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);
    const [step, setStep] = useState(1); // 2-step form for a smoother experience

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
    });

    useEffect(() => {
        if (isLoggedIn && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [isLoggedIn, user, navigate]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return;
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setTimeout(async () => {
            const result = await register(form);
            setLoading(false);
            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(result.error);
                if (result.error.includes("email")) setStep(1);
            }
        }, 600);
    };

    const features = [
        { icon: Zap, text: "Instant access to 10,000+ jobs" },
        { icon: Shield, text: "Verified companies only" },
        { icon: Sparkles, text: "AI-powered job matching" },
    ];

    const inputStyle = (field) => ({
        background: "rgba(255,255,255,0.06)",
        border: focused === field ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
        color: "#e2e8f0",
        caretColor: "#60a5fa",
        boxShadow: focused === field ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
    });

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.08]"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.06]"
                    style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
            </div>

            <div className="relative w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>

                {/* Left Panel — Branding */}
                <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)" }}>

                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-30"
                        style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
                    <div className="absolute bottom-10 left-0 w-32 h-32 rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <Briefcase className="w-7 h-7 text-blue-400" />
                            <span className="text-2xl font-bold text-white">HireHub</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-snug mb-3">
                            Join the community
                            <br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: "linear-gradient(135deg, #93c5fd, #c4b5fd)" }}>
                                of top talent
                            </span>
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: "#a5b4fc" }}>
                            Create your free account and start discovering your next dream role.
                        </p>
                    </div>

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

                    <div className="relative z-10 flex items-center gap-2 text-xs" style={{ color: "#6366f1" }}>
                        <Shield className="w-3.5 h-3.5" />
                        <span>256-bit SSL encryption</span>
                    </div>
                </div>

                {/* Right Panel — Form */}
                <div className="p-8 md:p-10" style={{ backdropFilter: "blur(16px)" }}>
                    <div className="text-center mb-6">
                        <div className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                            style={{ background: "rgba(99,102,241,0.15)" }}>
                            <Briefcase className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Create your account</h2>
                        <p className="mt-1.5 text-sm" style={{ color: "#64748b" }}>
                            {step === 1 ? "Let's get started with the basics" : "Almost done — just a few more details"}
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: "100%", background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                        </div>
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: step >= 2 ? "100%" : "0%", background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                        </div>
                    </div>

                    {/* Step 1: Name, Email, Password */}
                    {step === 1 && (
                        <form onSubmit={handleNext} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                        style={{ color: focused === "name" ? "#60a5fa" : "#475569" }} />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="John Doe"
                                        required
                                        id="signup-name"
                                        className="w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all duration-200"
                                        style={inputStyle("name")}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                        style={{ color: focused === "email" ? "#60a5fa" : "#475569" }} />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="you@example.com"
                                        required
                                        id="signup-email"
                                        className="w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all duration-200"
                                        style={inputStyle("email")}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                        style={{ color: focused === "password" ? "#60a5fa" : "#475569" }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        onFocus={() => setFocused("password")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="At least 6 characters"
                                        required
                                        minLength={6}
                                        id="signup-password"
                                        className="w-full rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none transition-all duration-200"
                                        style={inputStyle("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                                        style={{ color: "#475569" }}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs mt-1.5" style={{ color: "#475569" }}>Must be at least 6 characters</p>
                            </div>

                            {error && (
                                <div className="rounded-xl px-4 py-3 flex items-center gap-2"
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                    <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                id="signup-next"
                                className="w-full text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    )}

                    {/* Step 2: Phone, Location, Submit */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Confirmation of step 1 */}
                            <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{form.name}</p>
                                    <p className="text-xs truncate" style={{ color: "#64748b" }}>{form.email}</p>
                                </div>
                                <button type="button" onClick={() => setStep(1)}
                                    className="ml-auto text-xs font-medium transition-colors" style={{ color: "#60a5fa" }}>
                                    Edit
                                </button>
                            </div>

                            {/* Phone (optional) */}
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>
                                    Phone <span className="text-xs font-normal" style={{ color: "#475569" }}>(optional)</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                        style={{ color: focused === "phone" ? "#60a5fa" : "#475569" }} />
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        onFocus={() => setFocused("phone")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="+91 98765 43210"
                                        id="signup-phone"
                                        className="w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all duration-200"
                                        style={inputStyle("phone")}
                                    />
                                </div>
                            </div>

                            {/* Location (optional) */}
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>
                                    Location <span className="text-xs font-normal" style={{ color: "#475569" }}>(optional)</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                                        style={{ color: focused === "location" ? "#60a5fa" : "#475569" }} />
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => updateField("location", e.target.value)}
                                        onFocus={() => setFocused("location")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Hyderabad, India"
                                        id="signup-location"
                                        className="w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all duration-200"
                                        style={inputStyle("location")}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl px-4 py-3 flex items-center gap-2"
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                    <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                id="signup-submit"
                                className="w-full text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-center py-2 text-sm font-medium transition-colors"
                                style={{ color: "#64748b" }}
                                onMouseEnter={e => e.target.style.color = "#94a3b8"}
                                onMouseLeave={e => e.target.style.color = "#64748b"}
                            >
                                ← Back
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                        <span className="text-xs font-medium" style={{ color: "#475569" }}>Already have an account?</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>

                    <Link
                        to="/login"
                        className="block w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#e2e8f0"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                    >
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
}
