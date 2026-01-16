import apiClient from './client';
import { Router } from './types';

export const routersApi = {
  list: async (): Promise<Router[]> => {
    const response = await apiClient.get<Router[]>('/api/routers');
    return response.data;
  },

  get: async (id: string): Promise<Router> => {
    const response = await apiClient.get<Router>(`/api/routers/${id}`);
    return response.data;
  },
};
