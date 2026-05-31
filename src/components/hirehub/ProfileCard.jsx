// ─── ProfileCard.jsx ────────────────────────────────────────
// This component shows the user's profile information on the dashboard.
// It has two modes:
//   1. View mode — displays the user's name, email, phone, location, bio
//   2. Edit mode — shows input fields so the user can update their info

// Import React and useState hook for managing edit mode
import React, { useState } from "react";
// Import auth hook to get current user data and the update function
import { useHireHubAuth } from "../../context/AuthContext";
// Import icons used in the profile display
import { Mail, Phone, MapPin, Calendar, Pencil, X, Check } from "lucide-react";

// ─── ProfileCard Component ──────────────────────────────────
export default function ProfileCard() {
    // Get the current user and the function to update their profile
    const { user, updateUser } = useHireHubAuth();
    // Track whether we're in edit mode or view mode
    const [editing, setEditing] = useState(false);
    // Form data — pre-filled with current user info
    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        location: user?.location || "",
        bio: user?.bio || "",
    });

    // Don't render anything if there's no user logged in
    if (!user) return null;

    // ── Save changes: update the user data and exit edit mode ──
    const handleSave = () => {
        updateUser(form);  // Send updated fields to the auth context
        setEditing(false); // Switch back to view mode
    };

    // ── Cancel editing: revert form to current user data ──
    const handleCancel = () => {
        setForm({
            name: user.name,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
        });
        setEditing(false); // Switch back to view mode
    };

    // ── Role badge color ──
    // Admins get purple, regular users get blue
    const roleBadge =
        user.role === "admin"
            ? { background: "rgba(139,92,246,0.15)", color: "#a78bfa" }  // Purple for admin
            : { background: "rgba(59,130,246,0.15)", color: "#60a5fa" }; // Blue for user

    return (
        // Card container with semi-transparent dark background
        <div className="rounded-xl p-6 relative"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* "Edit Profile" button — only visible in view mode */}
            {!editing && (
                <button
                    onClick={() => setEditing(true)} // Switch to edit mode
                    className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Profile
                </button>
            )}

            {editing ? (
                // ═══════════════════════════════════════════
                // ── EDIT MODE: Show editable form fields ───
                // ═══════════════════════════════════════════
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Edit Profile</h3>

                    {/* Name input */}
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>

                    {/* Phone input */}
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Phone</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>

                    {/* Location input */}
                    <div>
                        <label className="text-sm mb-1 block" style={{ color: "#64748b" }}>Location</label>
                        <input
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                        />
                    </div>

                    {/* Bio textarea */}
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

                    {/* Save and Cancel buttons */}
                    <div className="flex gap-3">
                        {/* Save button — gradient blue */}
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            <Check className="w-4 h-4" />
                            Save
                        </button>
                        {/* Cancel button — neutral outline */}
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
                // ═══════════════════════════════════════════
                // ── VIEW MODE: Display user info ───────────
                // ═══════════════════════════════════════════
                <div className="flex flex-col sm:flex-row gap-5">
                    {/* User avatar circle showing initials */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold flex-shrink-0"
                        style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                        {user.avatar} {/* e.g., "AS" for Arjun Sharma */}
                    </div>
                    <div className="space-y-2 min-w-0">
                        {/* Name and role badge */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            {/* Role badge (Admin/User) */}
                            <span
                                className="rounded-full text-xs font-medium px-3 py-1 capitalize"
                                style={roleBadge}
                            >
                                {user.role}
                            </span>
                        </div>
                        {/* Contact info: email, phone, location */}
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
                        {/* Bio — only shown if the user has written one */}
                        {user.bio && (
                            <p className="text-sm italic" style={{ color: "#64748b" }}>{user.bio}</p>
                        )}
                        {/* Member since date */}
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