import apiClient from './client';
import { LoginRequest, LoginResponse, VerifyOTPRequest, VerifyOTPResponse } from './types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await apiClient.post<VerifyOTPResponse>('/api/auth/verify-otp', data);
    return response.data;
  },

  logout: async (logoutAll: boolean = false): Promise<void> => {
    await apiClient.post('/api/auth/logout', { logout_all: logoutAll });
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post<{ access_token: string }>('/api/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
