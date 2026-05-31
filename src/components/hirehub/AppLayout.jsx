// ─── AppLayout.jsx ──────────────────────────────────────────
// This is the shared layout wrapper used by all pages.
// It provides a consistent structure: Navbar on top, page content in the middle,
// and Footer always at the bottom. The dark background (#0b0f1a) is set here.

// Import React library
import React from "react";
// Import Outlet — this is where the current page's content gets rendered
import { Outlet } from "react-router-dom";
// Import the shared navigation bar and footer components
import Navbar from "./Navbar";
import Footer from "./Footer";

// ─── AppLayout Component ────────────────────────────────────
export default function AppLayout() {
    return (
        // Full-height flex container with dark background
        // "min-h-screen" ensures the layout covers the full viewport height
        // "flex flex-col" stacks Navbar, content, and Footer vertically
        <div className="min-h-screen flex flex-col" style={{ background: "#0b0f1a" }}>
            {/* Navigation bar — always visible at the top */}
            <Navbar />
            {/* Main content area — "flex-1" pushes the footer to the very bottom */}
            <main className="flex-1">
                <Outlet />
            </main>
            {/* Footer — always at the bottom of every page */}
            <Footer />
        </div>
    );
}