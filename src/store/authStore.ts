import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  return {
    accessToken,
    refreshToken,
    isAuthenticated: !!(accessToken && refreshToken),
    setTokens: (accessToken, refreshToken) => {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      set({ accessToken, refreshToken, isAuthenticated: true });
    },
    clearTokens: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    },
  };
});
