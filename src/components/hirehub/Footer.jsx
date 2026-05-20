import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Heart, Globe, Mail, MapPin } from "lucide-react";

export default function Footer() {
    const footerLinks = [
        { label: "Home", to: "/" },
        { label: "Jobs", to: "/jobs" },
        { label: "Dashboard", to: "/dashboard" },
    ];

    return (
        <footer className="mt-auto relative" style={{ background: "rgba(11,15,26,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Subtle top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(59,130,246,0.3), transparent)" }} />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                                <Briefcase className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">HireHub</span>
                        </Link>
                        <p className="text-sm max-w-xs leading-relaxed" style={{ color: "#475569" }}>
                            Connecting talented professionals with world-class remote opportunities.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-6">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-sm font-medium transition-colors duration-200"
                                style={{ color: "#64748b" }}
                                onMouseEnter={e => e.target.style.color = "#e2e8f0"}
                                onMouseLeave={e => e.target.style.color = "#64748b"}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Info Links */}
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

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <p className="text-xs" style={{ color: "#334155" }}>
                        © {new Date().getFullYear()} HireHub. All rights reserved.
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "#334155" }}>
                        Made with <Heart className="w-3 h-3 text-red-400" /> for job seekers everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
}