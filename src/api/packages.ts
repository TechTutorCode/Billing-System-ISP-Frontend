import apiClient from './client';
import { Package, PackageCreate, PackageUpdate, PackageType } from './types';

export const packagesApi = {
  listTypes: async (): Promise<PackageType[]> => {
    const response = await apiClient.get<PackageType[]>('/api/packages/package-types');
    return response.data;
  },

  listByRouter: async (routerId: string): Promise<Package[]> => {
    const response = await apiClient.get<Package[]>(`/api/routers/${routerId}/packages`);
    return response.data;
  },

  create: async (data: PackageCreate): Promise<Package> => {
    const response = await apiClient.post<Package>('/api/packages', data);
    return response.data;
  },

  update: async (id: string, data: PackageUpdate): Promise<Package> => {
    const response = await apiClient.put<Package>(`/api/packages/${id}`, data);
    return response.data;
  },

  sync: async (id: string, apiPassword?: string): Promise<{ status: string; profile: string; router: string }> => {
    const response = await apiClient.post<{ status: string; profile: string; router: string }>(
      `/api/packages/${id}/sync`,
      { api_password: apiPassword }
    );
    return response.data;
  },
};
