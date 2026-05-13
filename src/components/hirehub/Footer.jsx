import React from "react";
import { Briefcase } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-bold text-gray-800">HireHub</span>
                </div>
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} HireHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
}