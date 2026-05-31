// ─── Footer.jsx ─────────────────────────────────────────────
// This is the site-wide footer that appears at the bottom of every page.
// It contains the HireHub branding, navigation links,
// info tags (Remote First, Contact Us, Worldwide), and a copyright line.

// Import React library
import React from "react";
// Import Link component for internal navigation
import { Link } from "react-router-dom";
// Import icons used in the footer
import { Briefcase, Heart, Globe, Mail, MapPin } from "lucide-react";

// ─── Footer Component ──────────────────────────────────────
export default function Footer() {


    return (
        // Footer sticks to the bottom (mt-auto) with a dark background
        <footer className="mt-auto relative" style={{ background: "rgba(11,15,26,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

            {/* Decorative gradient line at the top of the footer */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(59,130,246,0.3), transparent)" }} />

            {/* Footer content container */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Three-column layout: brand | nav links | info tags */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

                    {/* ── Brand section: logo + tagline ── */}
                    <div className="space-y-3">
                        {/* HireHub logo — same as the navbar logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                                <Briefcase className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">HireHub</span>
                        </Link>
                        {/* Tagline describing what HireHub does */}
                        <p className="text-sm max-w-xs leading-relaxed" style={{ color: "#475569" }}>
                            Connecting talented professionals with world-class remote opportunities.
                        </p>
                    </div>



                    {/* ── Info tags: Remote First, Contact Us, Worldwide ── */}
                    <div className="flex items-center gap-4">
                        {[
                            { Icon: Globe, label: "Remote First" },
                            { Icon: Mail, label: "Contact Us" },
                            { Icon: MapPin, label: "Worldwide" },
                        ].map(({ Icon, label }) => (
                            <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
                                <Icon className="w-3.5 h-3.5" />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Bottom bar: copyright + "Made with ❤" ── */}
                <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    {/* Copyright notice — auto-updates the year */}
                    <p className="text-xs" style={{ color: "#334155" }}>
                        © {new Date().getFullYear()} HireHub. All rights reserved.
                    </p>
                    {/* "Made with ❤" message */}
                    <p className="text-xs flex items-center gap-1" style={{ color: "#334155" }}>
                        Made with <Heart className="w-3 h-3 text-red-400" /> for job seekers everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
}