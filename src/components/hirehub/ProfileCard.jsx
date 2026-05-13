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
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800";

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 relative">
            {!editing && (
                <button
                    onClick={() => setEditing(true)}
                    className="absolute top-4 right-4 flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Profile
                </button>
            )}

            {editing ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Location</label>
                        <input
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-semibold flex-shrink-0">
                        {user.avatar}
                    </div>
                    <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <span
                                className={`rounded-full text-xs font-medium px-3 py-1 capitalize ${roleBadge}`}
                            >
                                {user.role}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500">
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
                            <p className="text-sm italic text-gray-500">{user.bio}</p>
                        )}
                        <p className="flex items-center gap-1.5 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            Member since {user.joinedDate}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}