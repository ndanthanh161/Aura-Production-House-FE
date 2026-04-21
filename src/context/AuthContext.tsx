import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import type { AuthResponse, RegisterRequest } from '../types/auth.types';

// ─── Types ───────────────────────────────────────────────────────

export type Role = 'user' | 'staff' | 'admin' | null;

interface User {
    userId: string;
    fullName: string;
    email: string;
    role: string;
}

interface AuthContextType {
    role: Role;
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<Role>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

// ─── Constants ───────────────────────────────────────────────────

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'aura_access_token',
    REFRESH_TOKEN: 'aura_refresh_token',
    USER: 'aura_user',
    ROLE: 'aura_role',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────

function mapRole(beRole: string): Role {
    const lower = beRole.toLowerCase();
    if (lower === 'admin') return 'admin';
    if (lower === 'staff') return 'staff';
    return 'user';
}

function saveAuthToStorage(data: AuthResponse) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.ROLE, mapRole(data.role) as string);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
    }));
}

function clearAuthFromStorage() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ─── Context ─────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ── Restore auth state on mount ──────────────────────────────
    useEffect(() => {
        const restoreAuth = async () => {
            try {
                const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                const storedRefresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
                const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as Role;

                if (!storedToken || !storedUser || !storedRefresh) {
                    clearAuthFromStorage();
                    return;
                }

                // Validate token hiện tại
                try {
                    await authApi.getMe(); // token tự gắn qua interceptor
                    setAccessToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setRole(storedRole);
                } catch {
                    // Token hết hạn → thử refresh
                    try {
                        const result = await authApi.refreshToken(storedRefresh);
                        if (result.data) {
                            saveAuthToStorage(result.data);
                            setAccessToken(result.data.accessToken);
                            setUser({
                                userId: result.data.userId,
                                fullName: result.data.fullName,
                                email: result.data.email,
                                role: result.data.role,
                            });
                            setRole(mapRole(result.data.role));
                        }
                    } catch {
                        clearAuthFromStorage();
                    }
                }
            } catch {
                clearAuthFromStorage();
            } finally {
                setIsLoading(false);
            }
        };

        restoreAuth();
    }, []);

    // ── Login ────────────────────────────────────────────────────
    const login = useCallback(async (email: string, password: string): Promise<Role> => {
        const result = await authApi.login({ email, password });
        const data = result.data!;

        saveAuthToStorage(data);
        setAccessToken(data.accessToken);
        setUser({ userId: data.userId, fullName: data.fullName, email: data.email, role: data.role });
        const mappedRole = mapRole(data.role);
        setRole(mappedRole);
        return mappedRole;
    }, []);

    // ── Register: chỉ gọi API, KHÔNG set state, để user tự login ─
    const register = useCallback(async (data: RegisterRequest): Promise<void> => {
        await authApi.register(data);
        // Không saveAuthToStorage, không setUser, không setRole
    }, []);

    // ── Logout ───────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await authApi.logout(); // token tự gắn qua interceptor
        } catch {
            // Bỏ qua lỗi API, vẫn clear local state
        } finally {
            clearAuthFromStorage();
            setAccessToken(null);
            setUser(null);
            setRole(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ role, user, accessToken, isLoading, login, register, logout }}>
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