import { DashboardStats, RevenueData, SubscriptionStatusData } from './types';

// Mock API - Replace with actual endpoints when backend is ready
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
    // return response.data;
    
    // Mock data for now
    return Promise.resolve({
      total_customers: 0,
      active_subscriptions: 0,
      monthly_revenue: 0,
      active_routers: 0,
    });
  },

  getRevenueData: async (): Promise<RevenueData[]> => {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<RevenueData[]>('/api/dashboard/revenue');
    // return response.data;
    
    // Mock data for now
    return Promise.resolve([]);
  },

  getSubscriptionStatusData: async (): Promise<SubscriptionStatusData[]> => {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<SubscriptionStatusData[]>('/api/dashboard/subscription-status');
    // return response.data;
    
    // Mock data for now
    return Promise.resolve([]);
  },
};
