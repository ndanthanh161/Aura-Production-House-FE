import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7283/api';

// Create a separate axios instance for Chat API 
// because ChatController returns raw data (not wrapped in ApiResponse)
// so we can't use the main axiosInstance which normalizes all responses
const chatAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Auto-attach auth token
chatAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('aura_access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chatApi = {
    getKnowledge: () => chatAxios.get('/Chat/knowledge'),
    ingest: (data: { content: string, category: string }) => chatAxios.post('/Chat/ingest', data),
    deleteKnowledge: (id: string) => chatAxios.delete(`/Chat/knowledge/${id}`),
    getLogs: () => chatAxios.get('/Chat/logs'),
    togglePin: (id: string) => chatAxios.post(`/Chat/logs/${id}/toggle-pin`),
};
