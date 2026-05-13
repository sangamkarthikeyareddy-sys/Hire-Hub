import React from "react";
import { useNavigate } from "react-router-dom";
import { useHireHubAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import ProfileCard from "../components/hirehub/ProfileCard";
import StatsRow from "../components/hirehub/StatsRow";
import BookmarkedJobs from "../components/hirehub/BookmarkedJobs";

export default function Dashboard() {
    const { logout } = useHireHubAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            <div className="space-y-6">
                <ProfileCard />
                <StatsRow />
                <BookmarkedJobs />
            </div>
        </div>
    );
}