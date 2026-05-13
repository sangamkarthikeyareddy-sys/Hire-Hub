import React, { createContext, useContext, useState, useEffect } from "react";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const stored = localStorage.getItem("hirehub_bookmarks");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("hirehub_bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    const addBookmark = (job) => {
        setBookmarks((prev) => {
            if (prev.some((b) => b.id === job.id)) return prev;
            return [...prev, job];
        });
    };

    const removeBookmark = (id) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    const isBookmarked = (id) => {
        return bookmarks.some((b) => b.id === id);
    };

    return (
        <BookmarkContext.Provider
            value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}
        >
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    return useContext(BookmarkContext);
}