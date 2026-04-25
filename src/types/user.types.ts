// ─── User / Photographer / Customer Types ──────────────────────────

export interface UserDTO {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserRequest {
    id: string;
    fullName: string;
    phone?: string;
    avatar?: string;
}

export interface CreatePhotographerRequest {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
}
