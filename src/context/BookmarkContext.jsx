// ─── BookmarkContext.jsx ────────────────────────────────────
// This file manages the user's saved/bookmarked jobs.
// Bookmarks are stored in the browser's localStorage so they
// persist even after the browser is closed.

// Import React tools for creating shared state (context)
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a React Context for bookmarks — lets any component access saved jobs
const BookmarkContext = createContext(null);

// ─── BookmarkProvider Component ─────────────────────────────
// Wrap the app with this component to give every page access to bookmark functions.
export function BookmarkProvider({ children }) {
    // Initialize bookmarks from localStorage (or empty array if nothing saved)
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            // Try to read previously saved bookmarks from the browser
            const stored = localStorage.getItem("hirehub_bookmarks");
            // If found, parse the JSON string back into an array; otherwise start empty
            return stored ? JSON.parse(stored) : [];
        } catch {
            // If there's any error reading localStorage, start with empty bookmarks
            return [];
        }
    });

    // Whenever bookmarks change, save them to localStorage
    useEffect(() => {
        localStorage.setItem("hirehub_bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]); // Runs every time the bookmarks array changes

    // ── Add a job to bookmarks ──
    // Prevents duplicates by checking if the job is already saved
    const addBookmark = (job) => {
        setBookmarks((prev) => {
            // If this job ID is already in bookmarks, don't add it again
            if (prev.some((b) => b.id === job.id)) return prev;
            // Otherwise, add it to the end of the array
            return [...prev, job];
        });
    };

    // ── Remove a job from bookmarks by its ID ──
    const removeBookmark = (id) => {
        // Keep only the jobs whose ID does NOT match the one we're removing
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    // ── Check if a specific job is already bookmarked ──
    // Returns true if the job ID exists in the bookmarks array
    const isBookmarked = (id) => {
        return bookmarks.some((b) => b.id === id);
    };

    // ── Provide bookmark data and functions to all child components ──
    return (
        <BookmarkContext.Provider
            value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}
        >
            {children}
        </BookmarkContext.Provider>
    );
}

// ── Custom hook: lets any component easily access bookmark functions ──
// Usage: const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
export function useBookmarks() {
    return useContext(BookmarkContext);
}