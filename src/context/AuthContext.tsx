import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'user' | 'staff' | 'admin' | null;

interface AuthContextType {
    role: Role;
    login: (role: Role) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<Role>(() => {
        const saved = localStorage.getItem('aura_role');
        return (saved as Role) || null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const login = (newRole: Role) => {
        setRole(newRole);
        if (newRole) localStorage.setItem('aura_role', newRole);
        else localStorage.removeItem('aura_role');
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem('aura_role');
    };

    return (
        <AuthContext.Provider value={{ role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
