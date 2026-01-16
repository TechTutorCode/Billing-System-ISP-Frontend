import apiClient from './client';
import { Subscription, SubscriptionCreate } from './types';

export const subscriptionsApi = {
  list: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    customer_id?: string;
    router_id?: string;
  }): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>('/api/subscriptions', { params });
    return response.data;
  },

  get: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/api/subscriptions/${id}`);
    return response.data;
  },

  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/api/subscriptions', data);
    return response.data;
  },

  activate: async (id: string, apiPassword?: string): Promise<{ status_code: number; message: string; subscription_id: string; status: string }> => {
    const response = await apiClient.post(`/api/subscriptions/${id}/activate`, {
      api_password: apiPassword,
    });
    return response.data;
  },

  suspend: async (id: string, apiPassword?: string): Promise<{ status_code: number; message: string; subscription_id: string; status: string }> => {
    const response = await apiClient.post(`/api/subscriptions/${id}/suspend`, {
      api_password: apiPassword,
    });
    return response.data;
  },

  resume: async (id: string, apiPassword?: string): Promise<{ status_code: number; message: string; subscription_id: string; status: string }> => {
    const response = await apiClient.post(`/api/subscriptions/${id}/resume`, {
      api_password: apiPassword,
    });
    return response.data;
  },

  terminate: async (id: string, apiPassword?: string): Promise<{ status_code: number; message: string; subscription_id: string; status: string }> => {
    const response = await apiClient.post(`/api/subscriptions/${id}/terminate`, {
      api_password: apiPassword,
    });
    return response.data;
  },
};
