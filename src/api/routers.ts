import apiClient from './client';
import { Router, RouterStatusHistory, RouterCreate, RouterUpdate, RouterCreateResponse } from './types';

export const routersApi = {
  list: async (): Promise<Router[]> => {
    const response = await apiClient.get<Router[]>('/api/routers');
    return response.data;
  },

  get: async (id: string): Promise<Router> => {
    const response = await apiClient.get<Router>(`/api/routers/${id}`);
    return response.data;
  },

  create: async (data: RouterCreate): Promise<RouterCreateResponse> => {
    const response = await apiClient.post<RouterCreateResponse>('/api/routers', data);
    return response.data;
  },

  update: async (id: string, data: RouterUpdate): Promise<Router> => {
    const response = await apiClient.put<Router>(`/api/routers/${id}`, data);
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
