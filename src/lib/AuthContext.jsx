import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authError, setAuthError] = useState(null);

    const { data: user, isLoading: isLoadingAuth, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return null; // Base44 auth removed
        },
        retry: false
    });

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    const value = {
        user,
        isLoadingAuth,
        isLoadingPublicSettings: !isFetched, // Simplification
        authError,
        navigateToLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
