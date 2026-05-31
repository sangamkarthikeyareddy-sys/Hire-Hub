// ─── AuthContext.jsx ────────────────────────────────────────
// This file handles all authentication (login, logout, register).
// It uses JWT tokens stored in cookies to keep users logged in
// even after they close and reopen the browser.

// Import React tools for creating context (shared state across the app)
import React, { createContext, useContext, useState, useEffect } from "react";
// Import 'jose' library for creating and verifying JWT tokens
import { SignJWT, jwtVerify } from "jose";
// Import 'js-cookie' for reading/writing browser cookies
import Cookies from "js-cookie";
// Import the list of users (our simple database)
import users from "../data/users";

// Create a React Context — this lets any component access auth data
const AuthContext = createContext(null);

// ─── Configuration ──────────────────────────────────────────

// Secret key used to sign and verify JWT tokens
// (In a real app, this would be stored securely on the server)
const JWT_SECRET = new TextEncoder().encode("hirehub-jwt-secret-key-2025");

// Name of the cookie that stores the JWT token
const COOKIE_NAME = "hirehub_token";

// How long the token stays valid
const TOKEN_EXPIRY = "7d"; // 7 days

// How long the cookie stays in the browser
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Cookie settings for secure storage:
 * - expires:  The cookie auto-deletes after 7 days
 * - path:     The cookie is available on every page
 * - sameSite: Prevents cross-site request forgery attacks
 * - secure:   Only sends cookie over HTTPS in production
 */
const COOKIE_OPTIONS = {
    expires: COOKIE_EXPIRY_DAYS,
    path: "/",
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
};

// ─── Token Helper Functions ─────────────────────────────────

/**
 * Creates a signed JWT token containing user information.
 * This token proves the user is who they say they are.
 * @param {Object} user - The user object with id, email, role, name
 * @returns {Promise<string>} The signed JWT token string
 */
async function createToken(user) {
    return new SignJWT({
        sub: user.id,       // "subject" — the user's unique ID
        email: user.email,  // User's email address
        role: user.role,    // "user" or "admin"
        name: user.name,    // User's display name
    })
        .setProtectedHeader({ alg: "HS256" }) // Use HMAC-SHA256 algorithm
        .setIssuedAt()                         // Add timestamp of when token was created
        .setIssuer("hirehub")                  // Who issued the token
        .setAudience("hirehub-app")            // Who the token is intended for
        .setExpirationTime(TOKEN_EXPIRY)       // When the token expires
        .sign(JWT_SECRET);                     // Sign with our secret key
}

/**
 * Verifies a JWT token and extracts the user data from it.
 * Returns null if the token is invalid or expired.
 * @param {string} token - The JWT token string to verify
 * @returns {Promise<Object|null>} The token payload or null
 */
async function verifyToken(token) {
    try {
        // Try to verify the token with our secret key
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            issuer: "hirehub",       // Must match what we set when creating
            audience: "hirehub-app", // Must match what we set when creating
        });
        return payload; // Return the user data inside the token
    } catch {
        return null; // Token is invalid or expired
    }
}

// ─── Auth Provider Component ────────────────────────────────
// This component wraps the entire app and provides auth state to all pages.

export function HireHubAuthProvider({ children }) {
    // Track the currently logged-in user (null = not logged in)
    const [user, setUser] = useState(null);
    // Boolean flag: is someone logged in right now?
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // True while we're checking if there's an existing login session
    const [loading, setLoading] = useState(true);

    // ── On app start: check if user was previously logged in ──
    useEffect(() => {
        async function checkAuth() {
            // Look for an existing token in the browser cookies
            const token = Cookies.get(COOKIE_NAME);
            if (token) {
                // Verify the token is still valid
                const payload = await verifyToken(token);
                if (payload) {
                    // Find the matching user in our users list
                    const found = users.find((u) => u.id === payload.sub);
                    if (found) {
                        // Restore the user's session
                        setUser({ ...found });
                        setIsLoggedIn(true);
                    } else {
                        // User no longer exists — clear the cookie
                        Cookies.remove(COOKIE_NAME, { path: "/" });
                    }
                } else {
                    // Token is invalid or expired — clear the cookie
                    Cookies.remove(COOKIE_NAME, { path: "/" });
                }
            }
            // Done checking — stop showing the loading spinner
            setLoading(false);
        }
        checkAuth();
    }, []); // Empty array = run only once when app first loads

    // ── Login: find user by email + password, create token ──
    const login = async (email, password) => {
        // Search for a user with matching email AND password
        const found = users.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            // Create a JWT token for this user
            const token = await createToken(found);
            // Save the token in a cookie (persists between page refreshes)
            Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
            // Update the app state
            setUser({ ...found });
            setIsLoggedIn(true);
            return { success: true };
        }
        // No matching user found — return error
        return { success: false, error: "Invalid email or password" };
    };

    // ── Logout: clear the cookie and reset state ──
    const logout = () => {
        Cookies.remove(COOKIE_NAME, { path: "/" }); // Delete the cookie
        setUser(null);        // Clear user data
        setIsLoggedIn(false); // Mark as logged out
    };

    // ── Register: create a new user account ──
    const register = async ({ name, email, password, phone, location }) => {
        // Check if someone already registered with this email
        const exists = users.find((u) => u.email === email);
        if (exists) {
            return { success: false, error: "An account with this email already exists" };
        }

        // Create initials from the user's name (e.g., "John Doe" → "JD")
        const initials = name
            .split(" ")          // Split name into words
            .map((w) => w[0])    // Take first letter of each word
            .join("")            // Combine them
            .toUpperCase()       // Make uppercase
            .slice(0, 2);        // Keep only first 2 letters

        // Build the new user object
        const newUser = {
            id: `u${Date.now()}`,     // Unique ID using current timestamp
            name,                      // User's full name
            email,                     // Email address
            password,                  // Password (in production, this should be hashed!)
            role: "user",              // New users always get "user" role
            phone: phone || "",        // Phone number (optional)
            location: location || "",  // Location (optional)
            avatar: initials,          // Display initials as avatar
            bio: "",                   // Bio starts empty
            joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        };

        // Add the new user to our local users array
        users.push(newUser);

        // Create a JWT token and log them in automatically
        const token = await createToken(newUser);
        Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
        setUser({ ...newUser });
        setIsLoggedIn(true);
        return { success: true };
    };

    // ── Update user profile fields (name, bio, phone, etc.) ──
    const updateUser = (updatedFields) => {
        setUser((prev) => ({ ...prev, ...updatedFields }));
    };

    // ── Provide all auth functions and state to the app ──
    return (
        <AuthContext.Provider
            value={{ user, isLoggedIn, loading, login, logout, register, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ── Custom hook: lets any component easily access auth state ──
// Usage: const { user, isLoggedIn, login, logout } = useHireHubAuth();
export function useHireHubAuth() {
    return useContext(AuthContext);
}