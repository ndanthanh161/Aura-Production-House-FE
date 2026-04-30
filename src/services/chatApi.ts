import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const chatApi = {
    getKnowledge: () => axios.get(`${apiBaseUrl}/chat/knowledge`),
    ingest: (data: { content: string, category: string }) => axios.post(`${apiBaseUrl}/chat/ingest`, data),
    deleteKnowledge: (id: string) => axios.delete(`${apiBaseUrl}/chat/knowledge/${id}`),
    getLogs: () => axios.get(`${apiBaseUrl}/chat/logs`),
    togglePin: (id: string) => axios.post(`${apiBaseUrl}/chat/logs/${id}/toggle-pin`),
};
