import apiClient from './client';

export interface ISPProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  logo_url: string | null;
  website: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export const ispsApi = {
  getProfile: async (): Promise<ISPProfile> => {
    const response = await apiClient.get<ISPProfile>('/api/isps/profile');
    return response.data;
  },
};
