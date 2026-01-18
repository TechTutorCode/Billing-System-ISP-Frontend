import apiClient from './client';
import { Router, RouterStatusHistory } from './types';

export const routersApi = {
  list: async (): Promise<Router[]> => {
    const response = await apiClient.get<Router[]>('/api/routers');
    return response.data;
  },

  get: async (id: string): Promise<Router> => {
    const response = await apiClient.get<Router>(`/api/routers/${id}`);
    return response.data;
  },

  getStatusHistory: async (routerId: string, limit?: number): Promise<RouterStatusHistory[]> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get<RouterStatusHistory[]>(
      `/api/routers/${routerId}/status-history`,
      { params }
    );
    return response.data;
  },
};
