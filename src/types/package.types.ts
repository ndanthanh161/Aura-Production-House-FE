// ─── Package Types ─────────────────────────────────────────────────

export interface Package {
    id: string;
    name: string;
    price: number;
    description?: string;
    benefits: string[];
    isPopular: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePackageRequest {
    name: string;
    price: number;
    description?: string;
    benefits: string[];
    isPopular: boolean;
}

export interface UpdatePackageRequest {
    id: string;
    name: string;
    price: number;
    description?: string;
    benefits: string[];
    isPopular: boolean;
    isActive: boolean;
}
