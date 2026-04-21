// ─── Request DTOs ───────────────────────────────────────────────

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// ─── Response DTOs ──────────────────────────────────────────────

export interface AuthResponse {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
}

export interface ApiResponse<T> {
    succeeded: boolean;
    message: string;
    statusCode: number;
    data: T | null;
    errors: string[];
}

export interface MeResponse {
    userId: string;
    email: string;
    fullName: string;
    role: string;
}