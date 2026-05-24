export interface DocumentTemplate {
    id: string;
    title: string;
    description?: string;
    fileUrl: string;
    fileType: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentTemplateRequest {
    title: string;
    description?: string;
    file: File;
    isPublished: boolean;
}

export interface UpdateDocumentTemplateRequest {
    id: string;
    title: string;
    description?: string;
    isPublished: boolean;
}
