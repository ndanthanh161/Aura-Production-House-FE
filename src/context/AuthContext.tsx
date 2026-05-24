import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import type { AuthResponse, RegisterRequest } from '../types/auth.types';

// ─── Types ───────────────────────────────────────────────────────

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
    if (lower === 'photographer') return 'photographer';
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
        isVip: data.isVip,
        vipExpireAt: data.vipExpireAt,
        avatar: data.avatar,
    }));
}

function clearAuthFromStorage() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ─── Context ─────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    });
    const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
    const [role, setRole] = useState<Role>(() => (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || null);
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
                    const meRes = await authApi.getMe();
                    const me = meRes.data;
                    if (me) {
                        const updatedUser = {
                            userId: me.userId,
                            fullName: me.fullName,
                            email: me.email,
                            role: me.role,
                            isVip: me.isVip,
                            vipExpireAt: me.vipExpireAt,
                            avatar: me.avatar,
                        };
                        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
                        setAccessToken(storedToken);
                        setUser(updatedUser);
                        setRole(storedRole);
                    } else {
                        clearAuthFromStorage();
                    }
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
                                isVip: result.data.isVip,
                                vipExpireAt: result.data.vipExpireAt,
                                avatar: result.data.avatar,
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
        setUser({
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            isVip: data.isVip,
            vipExpireAt: data.vipExpireAt,
            avatar: data.avatar,
        });
        const mappedRole = mapRole(data.role);
        setRole(mappedRole);
        return mappedRole;
    }, []);

    // ── Google Login ─────────────────────────────────────────────
    const googleLogin = useCallback(async (idToken: string): Promise<Role> => {
        const result = await authApi.googleLogin(idToken);
        const data = result.data!;

        saveAuthToStorage(data);
        setAccessToken(data.accessToken);
        setUser({
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            isVip: data.isVip,
            vipExpireAt: data.vipExpireAt,
            avatar: data.avatar,
        });
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
