// ─── users.js ───────────────────────────────────────────────
// This file contains the list of pre-registered user accounts.
// It acts as a simple in-memory database for demo purposes.
// In a real app, user data would be stored in a backend database.

// ── List of demo users ──
// Each user has an id, name, email, password, role, and profile info.
// New users created via the Sign Up page are also added to this array at runtime.
const users = [
    {
        id: "u1",                        // Unique user identifier
        name: "Arjun Sharma",           // Full display name
        email: "user@hirehub.com",      // Email used for login
        password: "user123",            // Password (plain text for demo; hash in production!)
        role: "user",                   // Role: "user" = regular job seeker
        phone: "+91 98765 43210",       // Phone number
        location: "Hyderabad, Telangana", // City & state
        avatar: "AS",                   // Initials shown as avatar
        bio: "Frontend developer passionate about React and modern web technologies.",
        joinedDate: "January 2025"      // When they joined
    },
    {
        id: "u2",                        // Unique user identifier
        name: "Admin User",             // Full display name
        email: "admin@hirehub.com",     // Email used for login
        password: "admin123",           // Password
        role: "admin",                  // Role: "admin" = platform administrator
        phone: "+91 91234 56789",       // Phone number
        location: "Bangalore, Karnataka", // City & state
        avatar: "AU",                   // Initials shown as avatar
        bio: "Platform administrator managing job listings and user accounts.",
        joinedDate: "January 2024"      // When they joined
    }
];

// Export the users array so other files can import and use it
export default users;