import { axiosInstance } from '../lib/axiosInstance';

export const chatApi = {
    getKnowledge: () => axiosInstance.get('Chat/knowledge'),
    ingest: (data: { content: string, category: string }) => axiosInstance.post('Chat/ingest', data),
    deleteKnowledge: (id: string) => axiosInstance.delete(`Chat/knowledge/${id}`),
    getLogs: () => axiosInstance.get('Chat/logs'),
    togglePin: (id: string) => axiosInstance.post(`Chat/logs/${id}/toggle-pin`),
};
