import React, { useState } from "react";
import { useHireHubAuth } from "../../context/AuthContext";
import { Mail, Phone, MapPin, Calendar, Pencil, X, Check } from "lucide-react";

export default function ProfileCard() {
    const { user, updateUser } = useHireHubAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        location: user?.location || "",
        bio: user?.bio || "",
    });

    if (!user) return null;

    const handleSave = () => {
        updateUser(form);
        setEditing(false);
    };

    const handleCancel = () => {
        setForm({
            name: user.name,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
        });
        setEditing(false);
    };

    const roleBadge =
        user.role === "admin"
            ? { background: "rgba(139,92,246,0.15)", color: "#a78bfa" }
            : { background: "rgba(59,130,246,0.15)", color: "#60a5fa" };

    return (
        <div className="rounded-xl p-6 relative"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {!editing && (
                <button
                    onClick={() => setEditing(true)}
                    className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Profile
                </button>
            )}

            {editing ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Phone</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Location</label>
                        <input
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            <Check className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold flex-shrink-0"
                        style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                        {user.avatar}
                    </div>
                    <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <span
                                className="rounded-full text-xs font-medium px-3 py-1 capitalize"
                                style={roleBadge}
                            >
                                {user.role}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm" style={{ color: "#64748b" }}>
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4" />
                                {user.phone}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {user.location}
                            </span>
                        </div>
                        {user.bio && (
                            <p className="text-sm italic" style={{ color: "#64748b" }}>{user.bio}</p>
                        )}
                        <p className="flex items-center gap-1.5 text-sm" style={{ color: "#475569" }}>
                            <Calendar className="w-4 h-4" />
                            Member since {user.joinedDate}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}