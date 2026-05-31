// ─── Home.jsx ───────────────────────────────────────────────
// This is the public landing page that visitors see before logging in.
// It showcases HireHub's features with a modern, animated design:
//   - Hero section with search bar and gradient text
//   - Animated stat counters (jobs, companies, hires, success rate)
//   - Job categories grid (Software Dev, Design, Marketing, etc.)
//   - Features section explaining why to choose HireHub
//   - Testimonials from happy users
//   - Call-to-action (CTA) banner to encourage sign-ups

// Import React and hooks for state, effects, and refs
import React, { useState, useEffect, useRef } from "react";
// Import navigation hook for redirecting after search
import { useNavigate } from "react-router-dom";
// Import all icons used across the landing page sections
import {
    Search, ArrowRight, Briefcase, Globe, Zap, Shield,
    Star, Users, TrendingUp, Heart, Play, ChevronRight,
    Sparkles, Award, Target, Rocket, CheckCircle2, ArrowUpRight
} from "lucide-react";
// Import auth hook to check if user is already logged in
import { useHireHubAuth } from "../context/AuthContext";

/* ─── useCounter: Animated number counting hook ─────────── */
// This hook animates a number from 0 to the target value
// when the element scrolls into view. Uses IntersectionObserver
// and requestAnimationFrame for smooth 60fps animation.
function useCounter(target, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const tick = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

/* ─── Data ───────────────────────────────────────────────── */
const STATS = [
    { label: "Active Jobs", value: 10000, suffix: "+", icon: Briefcase },
    { label: "Companies Hiring", value: 2500, suffix: "+", icon: Globe },
    { label: "Hires This Month", value: 1200, suffix: "+", icon: Target },
    { label: "Success Rate", value: 97, suffix: "%", icon: Award },
];

const CATEGORIES = [
    { label: "Software Dev", icon: "💻", count: "3,200+", gradient: "from-blue-500 to-indigo-600" },
    { label: "Design", icon: "🎨", count: "1,100+", gradient: "from-pink-500 to-rose-600" },
    { label: "Marketing", icon: "📢", count: "980+", gradient: "from-amber-500 to-orange-600" },
    { label: "Data & AI", icon: "🤖", count: "1,400+", gradient: "from-emerald-500 to-teal-600" },
    { label: "Product", icon: "📦", count: "760+", gradient: "from-violet-500 to-purple-600" },
    { label: "DevOps", icon: "⚙️", count: "650+", gradient: "from-cyan-500 to-blue-600" },
    { label: "Finance", icon: "💰", count: "540+", gradient: "from-lime-500 to-green-600" },
    { label: "Support", icon: "🎧", count: "420+", gradient: "from-fuchsia-500 to-pink-600" },
];

const FEATURES = [
    { icon: Globe, title: "100% Remote", desc: "Every job is fully remote. No office, no commute — just great work from anywhere in the world.", gradient: "from-blue-500 to-cyan-500" },
    { icon: Zap, title: "Instant Apply", desc: "Apply to jobs in seconds. No lengthy forms — your profile does all the talking.", gradient: "from-amber-500 to-orange-500" },
    { icon: Shield, title: "Verified Companies", desc: "Every company is vetted. You only see real, high-quality job listings from trusted employers.", gradient: "from-emerald-500 to-green-500" },
    { icon: Heart, title: "Save & Revisit", desc: "Bookmark your favourite roles and revisit them anytime from your personal dashboard.", gradient: "from-pink-500 to-rose-500" },
    { icon: TrendingUp, title: "Career Growth", desc: "Find roles that challenge you, match your ambitions, and elevate your career trajectory.", gradient: "from-violet-500 to-purple-500" },
    { icon: Users, title: "Global Community", desc: "Join 50,000+ remote professionals who've already found their dream jobs here.", gradient: "from-cyan-500 to-teal-500" },
];

const TESTIMONIALS = [
    { name: "Priya Mehta", role: "Frontend Engineer", company: "Stripe", avatar: "PM", color: "from-blue-400 to-indigo-500", text: "HireHub helped me land a €90k remote role in under 2 weeks. The listings are fresh and the experience is seamless." },
    { name: "Carlos Ruiz", role: "Product Manager", company: "Notion", avatar: "CR", color: "from-emerald-400 to-teal-500", text: "I was skeptical, but HireHub delivered. Intuitive filters, real companies, and zero spam. Highly recommend." },
    { name: "Aisha Nkosi", role: "Data Scientist", company: "Spotify", avatar: "AN", color: "from-violet-400 to-purple-500", text: "The bookmark feature is a game changer. I curated my shortlist and applied systematically. Got hired in 3 weeks!" },
    { name: "Tom Fischer", role: "DevOps Engineer", company: "GitLab", avatar: "TF", color: "from-orange-400 to-red-500", text: "After months of searching elsewhere, HireHub connected me with my ideal role in just 10 days. Outstanding." },
];

const TRUSTED_LOGOS = ["Google", "Microsoft", "Meta", "Amazon", "Apple", "Netflix", "Spotify", "Stripe"];

const STEPS = [
    { step: "01", title: "Create Your Profile", desc: "Sign up in 30 seconds. Add your skills, experience, and what you're looking for.", icon: Sparkles },
    { step: "02", title: "Discover & Filter", desc: "Browse thousands of remote jobs. Filter by category, type, salary, and location.", icon: Search },
    { step: "03", title: "Apply Instantly", desc: "Found the one? Apply with a single click. Your profile does the rest.", icon: Rocket },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/* ─── Hero ───────────────────────────────────────────────── */
function HeroSection() {
    const navigate = useNavigate();
    const { isLoggedIn } = useHireHubAuth();

    return (
        <section className="relative overflow-hidden min-h-[92vh] flex items-center">
            {/* Animated gradient background */}
            <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #1e1b4b 100%)"
            }} />

            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", animation: "pulse 4s ease-in-out infinite" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", animation: "pulse 5s ease-in-out infinite 1s" }} />
            <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)", animation: "pulse 6s ease-in-out infinite 2s" }} />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative max-w-7xl mx-auto px-4 py-20 text-center w-full">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium mb-8"
                    style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>
                    <Sparkles className="w-4 h-4" />
                    #1 Remote Job Platform — Trusted by 50,000+ Professionals
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-[80px] font-extrabold leading-[1.05] tracking-tight text-white">
                    Find Your Next
                    <br />
                    <span className="text-transparent bg-clip-text"
                        style={{ backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #38bdf8 100%)" }}>
                        Dream Career
                    </span>
                </h1>

                <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
                    Discover thousands of curated remote opportunities from world-class companies.
                    <br className="hidden md:block" />
                    Work from anywhere. Build the life you want.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => navigate("/jobs")}
                                className="inline-flex items-center justify-center gap-2 text-white font-semibold rounded-xl px-8 py-4 text-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                                <Search className="w-4 h-4" />
                                Browse Jobs
                            </button>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-8 py-4 text-sm transition-all duration-300 hover:bg-white/10"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0" }}>
                                My Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/login")}
                                className="inline-flex items-center justify-center gap-2 text-white font-semibold rounded-xl px-8 py-4 text-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                                Get Started Free
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate("/login?redirect=/jobs")}
                                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-8 py-4 text-sm transition-all duration-300 hover:bg-white/10"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0" }}>
                                <Briefcase className="w-4 h-4" />
                                Browse Jobs
                            </button>
                        </>
                    )}
                </div>

                {/* Trusted by */}
                <div className="mt-16">
                    <p className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: "#475569" }}>
                        Trusted by teams at
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {TRUSTED_LOGOS.map((name) => (
                            <span key={name} className="text-lg font-bold tracking-wide transition-colors duration-200 hover:text-slate-300"
                                style={{ color: "#334155" }}>
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Stats Counter ──────────────────────────────────────── */
function StatsSection() {
    return (
        <section className="relative -mt-16 z-10 max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {STATS.map((stat) => {
                    const counter = useCounter(stat.value);
                    return (
                        <div key={stat.label} ref={counter.ref}
                            className="rounded-2xl p-6 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 30px rgba(0,0,0,0.2)" }}>
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                                style={{ background: "rgba(99,102,241,0.15)" }}>
                                <stat.icon className="w-5 h-5 text-blue-400" />
                            </div>
                            <p className="text-3xl font-extrabold text-white">
                                {counter.count.toLocaleString()}{stat.suffix}
                            </p>
                            <p className="text-sm mt-1 font-medium" style={{ color: "#64748b" }}>{stat.label}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ─── How it Works ───────────────────────────────────────── */
function HowItWorks() {
    const navigate = useNavigate();
    return (
        <section className="max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
                <span className="inline-block text-sm font-semibold rounded-full px-4 py-1.5 mb-4"
                    style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
                    How It Works
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                    Land your dream job in <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>3 simple steps</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {STEPS.map((s, i) => (
                    <div key={s.step} className="relative group">
                        {i < STEPS.length - 1 && (
                            <div className="hidden md:block absolute top-16 left-[60%] w-[80%] border-t-2 border-dashed" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                        )}
                        <div className="relative rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                                    <s.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-5xl font-black" style={{ color: "rgba(255,255,255,0.06)" }}>{s.step}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                            <p className="leading-relaxed" style={{ color: "#64748b" }}>{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-12">
                <button onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-2 text-white font-semibold rounded-xl px-8 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                    Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}

/* ─── Categories ─────────────────────────────────────────── */
function CategoriesSection() {
    const navigate = useNavigate();
    const { isLoggedIn } = useHireHubAuth();
    const handleClick = (label) => {
        if (isLoggedIn) {
            navigate(`/jobs?q=${encodeURIComponent(label)}`);
        } else {
            navigate(`/login?redirect=${encodeURIComponent(`/jobs?q=${encodeURIComponent(label)}`)}`);
        }
    };
    return (
        <section className="py-24" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-14">
                    <span className="inline-block text-sm font-semibold rounded-full px-4 py-1.5 mb-4"
                        style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                        Explore
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        Browse by <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #10b981, #06b6d4)" }}>Category</span>
                    </h2>
                    <p className="mt-3 max-w-lg mx-auto" style={{ color: "#64748b" }}>Find the perfect role in your field — from engineering to design and beyond</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {CATEGORIES.map((cat) => (
                        <button key={cat.label} onClick={() => handleClick(cat.label)}
                            className="group relative rounded-2xl p-6 text-left overflow-hidden hover:-translate-y-2 transition-all duration-300"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="relative">
                                <div className="text-3xl mb-3">{cat.icon}</div>
                                <p className="font-bold text-white transition-colors text-lg">{cat.label}</p>
                                <p className="text-sm transition-colors mt-1" style={{ color: "#64748b" }}>{cat.count} jobs</p>
                                <ArrowUpRight className="w-4 h-4 mt-3 transition-colors" style={{ color: "#475569" }} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Features ───────────────────────────────────────────── */
function FeaturesSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-14">
                <span className="inline-block text-sm font-semibold rounded-full px-4 py-1.5 mb-4"
                    style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>
                    Why HireHub
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                    Everything you need to <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>land your next role</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((f) => (
                    <div key={f.title} className="group rounded-2xl p-7 hover:-translate-y-2 transition-all duration-300"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                            <f.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                        <p className="leading-relaxed" style={{ color: "#64748b" }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─── Testimonials ───────────────────────────────────────── */
function TestimonialsSection() {
    return (
        <section className="py-24" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-14">
                    <span className="inline-block text-sm font-semibold rounded-full px-4 py-1.5 mb-4"
                        style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        Loved by <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>job seekers worldwide</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} className="rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex gap-0.5 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: "#94a3b8" }}>"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} text-white flex items-center justify-center text-xs font-bold`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{t.name}</p>
                                    <p className="text-xs" style={{ color: "#475569" }}>{t.role} @ {t.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── CTA Banner ─────────────────────────────────────────── */
function CTASection() {
    const navigate = useNavigate();
    return (
        <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
                style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>
                {/* Glowing orbs */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-15"
                    style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />

                <div className="relative">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Ready to start your
                        <br />
                        <span className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa, #38bdf8)" }}>
                            remote journey?
                        </span>
                    </h2>
                    <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "#94a3b8" }}>
                        Join 50,000+ professionals who already found their perfect remote job on HireHub.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate("/login?redirect=/jobs")}
                            className="text-white font-semibold rounded-xl px-8 py-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                            Browse Jobs — It's Free
                        </button>
                        <button onClick={() => navigate("/login")}
                            className="font-semibold rounded-xl px-8 py-4 transition-all duration-300 hover:bg-white/10"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0" }}>
                            Create Account
                        </button>
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: "#64748b" }}>
                        {["No credit card required", "Free forever plan", "Setup in 30 seconds"].map((item) => (
                            <span key={item} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
    const { isLoggedIn } = useHireHubAuth();

    return (
        <div>
            <HeroSection />
            <StatsSection />
            <HowItWorks />
            {isLoggedIn && <CategoriesSection />}
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
}