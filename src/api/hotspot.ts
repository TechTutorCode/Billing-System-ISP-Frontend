import axios from 'axios';
import apiClient from './client';

// Hotspot-specific types
export interface HotspotPackage {
  id: string;
  name: string;
  download_speed: number;
  upload_speed: number;
  validity_value: number;
  validity_unit: 'minutes' | 'hours' | 'days';
  data_limit_gb: number | null;
  price: string;
  mikrotik_profile_name: string | null;
  is_active: boolean;
}

export interface MacVoucherRequest {
  mac_address: string;
  package_id?: string;
  dst?: string; // MikroTik redirect destination
}

export interface MacVoucherResponse {
  status_code: number;
  message: string;
  voucher?: {
    username: string;
    password: string;
    mac_address: string;
    package_id: string;
    expires_at: string;
  };
  login_url?: string;
}

export interface HotspotTemplate {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface SessionInfo {
  username: string;
  package_name: string;
  expires_at: string;
  download_speed: number;
  upload_speed: number;
}

// Admin view types for hotspot management
export interface HotspotUser {
  id: string;
  mac_address: string;
  username: string;
  package_id: string;
  package_name?: string;
  expires_at: string;
  created_at: string;
  status: 'active' | 'expired' | 'suspended';
}

export interface HotspotPackageAdmin extends HotspotPackage {
  router_id: string;
  router_name?: string;
  package_type_id: string;
  mikrotik_synced: boolean;
  mikrotik_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

// Create a separate client for hotspot portal (no auth required)
const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'https://wifibill.techtutor.co.ke';
  return url.replace(/\/$/, '');
};

const hotspotClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// No auth interceptor needed for hotspot endpoints (public access)

export const hotspotApi = {
  // Get active hotspot packages
  getPackages: async (): Promise<HotspotPackage[]> => {
    const response = await hotspotClient.get<HotspotPackage[]>('/hotspot/packages');
    return response.data;
  },

  // Create MAC-based voucher
  createMacVoucher: async (data: MacVoucherRequest): Promise<MacVoucherResponse> => {
    const response = await hotspotClient.post<MacVoucherResponse>('/hotspot/mac-vouchers', data);
    return response.data;
  },

  // Get active template (optional - if backend supports it)
  getTemplate: async (templateId?: string): Promise<HotspotTemplate | null> => {
    try {
      const endpoint = templateId 
        ? `/hotspot/templates/${templateId}`
        : '/hotspot/templates/active';
      const response = await hotspotClient.get<HotspotTemplate>(endpoint);
      return response.data;
    } catch (error) {
      // If template endpoint doesn't exist, return null
      return null;
    }
  },

  // Get session info (optional - if backend supports it)
  getSessionInfo: async (macAddress: string): Promise<SessionInfo | null> => {
    try {
      const response = await hotspotClient.get<SessionInfo>(`/hotspot/sessions/${macAddress}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

// Admin API methods (require authentication)
export const hotspotAdminApi = {
  // Get all hotspot packages (admin view with router info)
  getHotspotPackages: async (): Promise<HotspotPackageAdmin[]> => {
    const response = await apiClient.get<HotspotPackageAdmin[]>('/api/packages/hotspot');
    return response.data;
  },

  // Get all hotspot users/vouchers
  getHotspotUsers: async (): Promise<HotspotUser[]> => {
    const response = await apiClient.get<HotspotUser[]>('/api/hotspot/users');
    return response.data;
  },

  // Get hotspot user by ID
  getHotspotUser: async (id: string): Promise<HotspotUser> => {
    const response = await apiClient.get<HotspotUser>(`/api/hotspot/users/${id}`);
    return response.data;
  },

  // Delete/revoke hotspot user
  deleteHotspotUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/hotspot/users/${id}`);
  },
};
