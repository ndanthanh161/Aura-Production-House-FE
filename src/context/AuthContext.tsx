import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { setAccessToken as setAxiosAccessToken } from '../lib/axiosInstance';
import type { AuthResponse, RegisterRequest } from '../types/auth.types';

export type Role = 'user' | 'photographer' | 'admin' | null;

interface User {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    isVip?: boolean;
    vipExpireAt?: string | null;
    avatar?: string | null;
}

interface AuthContextType {
    role: Role;
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<Role>;
    googleLogin: (idToken: string) => Promise<Role>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'aura_access_token',
    REFRESH_TOKEN: 'aura_refresh_token',
    USER: 'aura_user',
    ROLE: 'aura_role',
} as const;

function mapRole(beRole: string): Role {
    const lower = beRole.toLowerCase();
    if (lower === 'admin') return 'admin';
    if (lower === 'photographer') return 'photographer';
    return 'user';
}

function buildUser(data: AuthResponse): User {
    return {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        isVip: data.isVip,
        vipExpireAt: data.vipExpireAt,
        avatar: data.avatar,
    };
}

function readStoredUser(): User | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function saveSessionProfile(user: User, role: Role) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (role) {
        localStorage.setItem(STORAGE_KEYS.ROLE, role);
    }
}

function clearAuthFromStorage() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => readStoredUser());
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [role, setRole] = useState<Role>(() => (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || null);
    const [isLoading, setIsLoading] = useState(true);

    const applyAuthResponse = useCallback((data: AuthResponse): Role => {
        const mappedRole = mapRole(data.role);
        const nextUser = buildUser(data);

        setAxiosAccessToken(data.accessToken);
        setAccessTokenState(data.accessToken);
        setUser(nextUser);
        setRole(mappedRole);
        saveSessionProfile(nextUser, mappedRole);

        return mappedRole;
    }, []);

    const clearAuthState = useCallback(() => {
        setAxiosAccessToken(null);
        setAccessTokenState(null);
        setUser(null);
        setRole(null);
        clearAuthFromStorage();
    }, []);

    useEffect(() => {
        const restoreAuth = async () => {
            clearAuthFromStorage();

            try {
                const result = await authApi.refreshToken();
                if (result.data?.accessToken) {
                    applyAuthResponse(result.data);
                } else {
                    clearAuthState();
                }
            } catch {
                clearAuthState();
            } finally {
                setIsLoading(false);
            }
        };

        restoreAuth();
    }, [applyAuthResponse, clearAuthState]);

    const login = useCallback(async (email: string, password: string): Promise<Role> => {
        const result = await authApi.login({ email, password });
        const data = result.data!;
        return applyAuthResponse(data);
    }, [applyAuthResponse]);

    const googleLogin = useCallback(async (idToken: string): Promise<Role> => {
        const result = await authApi.googleLogin(idToken);
        const data = result.data!;
        return applyAuthResponse(data);
    }, [applyAuthResponse]);

    const register = useCallback(async (data: RegisterRequest): Promise<void> => {
        await authApi.register(data);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Always clear client state even if the server logout request fails.
        } finally {
            clearAuthState();
        }
    }, [clearAuthState]);

    return (
        <AuthContext.Provider value={{ role, user, accessToken, isLoading, login, googleLogin, register, logout }}>
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
