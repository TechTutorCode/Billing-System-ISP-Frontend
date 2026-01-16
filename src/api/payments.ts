import apiClient from './client';
import { Payment, PaymentCreate } from './types';

// Mock API - Replace with actual endpoints when backend is ready
export const paymentsApi = {
  list: async (subscriptionId?: string): Promise<Payment[]> => {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<Payment[]>('/api/payments', { params: { subscription_id: subscriptionId } });
    // return response.data;
    
    // Mock data for now
    return Promise.resolve([]);
  },

  create: async (data: PaymentCreate): Promise<Payment> => {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.post<Payment>('/api/payments', data);
    // return response.data;
    
    // Mock response
    return Promise.resolve({
      id: Math.random().toString(36).substr(2, 9),
      subscription_id: data.subscription_id,
      amount: data.amount,
      payment_method: data.payment_method,
      status: 'success',
      transaction_id: data.transaction_id,
      created_at: new Date().toISOString(),
    });
  },
};
