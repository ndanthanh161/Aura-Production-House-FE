// ─── Package Types ─────────────────────────────────────────────────

export interface Package {
    id: string;
    name: string;
    price: number;
    description?: string;
    features: string;
    isPopular: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePackageRequest {
    name: string;
    price: number;
    description?: string;
    features: string;
    isPopular: boolean;
    isActive: boolean;
}

export interface UpdatePackageRequest extends CreatePackageRequest {
    id: string;
}
