import apiClient from './client';
import { Customer, CustomerCreate, CustomerUpdate } from './types';

export const customersApi = {
  list: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>('/api/customers', { params });
    return response.data;
  },

  get: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/api/customers/${id}`);
    return response.data;
  },

  create: async (data: CustomerCreate): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/api/customers', data);
    return response.data;
  },

  update: async (id: string, data: CustomerUpdate): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/api/customers/${id}`, data);
    return response.data;
  },
};
