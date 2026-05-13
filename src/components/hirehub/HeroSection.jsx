import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

export default function HeroSection() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    };

    return (
        <section
            className="py-20 md:py-28"
            style={{
                background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Find Your Dream{" "}
                    <span className="text-blue-500">Remote Job</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                    Discover thousands of remote opportunities from top companies around the world.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mt-8 max-w-2xl mx-auto flex items-center bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden"
                >
                    <div className="flex items-center flex-1 px-5 gap-3">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search jobs, companies, or keywords..."
                            className="w-full py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-3.5 mr-1.5 rounded-full transition-colors flex-shrink-0"
                    >
                        Search
                    </button>
                </form>

                <button
                    onClick={() => navigate("/jobs")}
                    className="mt-6 inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                    Browse All Jobs
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}