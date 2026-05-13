import React, { createContext, useContext, useState, useEffect } from "react";
import { SignJWT, jwtVerify } from "jose";
import Cookies from "js-cookie";
import users from "../data/users";

const AuthContext = createContext(null);

// Secret key for signing/verifying JWTs (in production, this lives on the server)
const JWT_SECRET = new TextEncoder().encode("hirehub-jwt-secret-key-2025");
const COOKIE_NAME = "hirehub_token";
const TOKEN_EXPIRY = "7d"; // Token expires in 7 days
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Cookie options for secure token storage.
 * - expires:  auto-remove after 7 days
 * - path:     available on all routes
 * - sameSite: protects against CSRF
 * - secure:   only sent over HTTPS in production
 */
const COOKIE_OPTIONS = {
    expires: COOKIE_EXPIRY_DAYS,
    path: "/",
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
};

/**
 * Create a signed JWT with user claims.
 */
async function createToken(user) {
    return new SignJWT({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("hirehub")
        .setAudience("hirehub-app")
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(JWT_SECRET);
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired.
 */
async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            issuer: "hirehub",
            audience: "hirehub-app",
        });
        return payload;
    } catch {
        return null;
    }
}

export function HireHubAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // On mount, verify existing token from cookie
    useEffect(() => {
        async function checkAuth() {
            const token = Cookies.get(COOKIE_NAME);
            if (token) {
                const payload = await verifyToken(token);
                if (payload) {
                    const found = users.find((u) => u.id === payload.sub);
                    if (found) {
                        setUser({ ...found });
                        setIsLoggedIn(true);
                    } else {
                        Cookies.remove(COOKIE_NAME, { path: "/" });
                    }
                } else {
                    // Token is invalid or expired
                    Cookies.remove(COOKIE_NAME, { path: "/" });
                }
            }
            setLoading(false);
        }
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const found = users.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            const token = await createToken(found);
            Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
            setUser({ ...found });
            setIsLoggedIn(true);
            return { success: true };
        }
        return { success: false, error: "Invalid email or password" };
    };

    const logout = () => {
        Cookies.remove(COOKIE_NAME, { path: "/" });
        setUser(null);
        setIsLoggedIn(false);
    };

    const updateUser = (updatedFields) => {
        setUser((prev) => ({ ...prev, ...updatedFields }));
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoggedIn, loading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useHireHubAuth() {
    return useContext(AuthContext);
}