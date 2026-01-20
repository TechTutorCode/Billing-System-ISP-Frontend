import { DashboardStats, RevenueData, SubscriptionStatusData } from './types';
import { customersApi } from './customers';
import { subscriptionsApi } from './subscriptions';
import { routersApi } from './routers';
import { paymentsApi } from './payments';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch all data in parallel
      const [customers, subscriptions, routers, paymentsResult] = await Promise.allSettled([
        customersApi.list({ limit: 10000 }),
        subscriptionsApi.list({ limit: 10000 }),
        routersApi.list(),
        paymentsApi.list().catch(() => []), // Payments might not be implemented yet
      ]);

      // Extract data from settled promises
      const customersData = customers.status === 'fulfilled' ? customers.value : [];
      const subscriptionsData = subscriptions.status === 'fulfilled' ? subscriptions.value : [];
      const routersData = routers.status === 'fulfilled' ? routers.value : [];
      const paymentsData = paymentsResult.status === 'fulfilled' ? paymentsResult.value : [];

      // Calculate stats
      const totalCustomers = customersData.length;
      
      const activeSubscriptions = subscriptionsData.filter(
        (sub) => sub.status === 'active'
      ).length;

      // Calculate monthly revenue (current month)
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = paymentsData
        .filter((payment) => {
          const paymentDate = new Date(payment.created_at);
          return (
            paymentDate >= currentMonthStart &&
            payment.status === 'success'
          );
        })
        .reduce((sum, payment) => sum + payment.amount, 0);

      const activeRouters = routersData.filter(
        (router) => router.status === 'online'
      ).length;

      return {
        total_customers: totalCustomers,
        active_subscriptions: activeSubscriptions,
        monthly_revenue: monthlyRevenue,
        active_routers: activeRouters,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return zeros on error
      return {
        total_customers: 0,
        active_subscriptions: 0,
        monthly_revenue: 0,
        active_routers: 0,
      };
    }
  },

  getRevenueData: async (): Promise<RevenueData[]> => {
    try {
      const paymentsResult = await paymentsApi.list().catch(() => []);
      const payments = Array.isArray(paymentsResult) ? paymentsResult : [];
      
      // Group payments by date (last 30 days)
      const revenueMap = new Map<string, number>();
      const now = new Date();
      
      // Initialize last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        revenueMap.set(dateKey, 0);
      }

      // Add payment amounts
      payments
        .filter((payment) => payment.status === 'success')
        .forEach((payment) => {
          const paymentDate = new Date(payment.created_at);
          const dateKey = paymentDate.toISOString().split('T')[0];
          const currentRevenue = revenueMap.get(dateKey) || 0;
          revenueMap.set(dateKey, currentRevenue + payment.amount);
        });

      // Convert to array format
      return Array.from(revenueMap.entries()).map(([date, revenue]) => ({
        date,
        revenue,
      }));
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }
  },

  getSubscriptionStatusData: async (): Promise<SubscriptionStatusData[]> => {
    try {
      const subscriptions = await subscriptionsApi.list({ limit: 10000 });
      
      // Count by status
      const statusCounts = new Map<string, number>();
      subscriptions.forEach((sub) => {
        const count = statusCounts.get(sub.status) || 0;
        statusCounts.set(sub.status, count + 1);
      });

      // Convert to array format
      return Array.from(statusCounts.entries()).map(([status, count]) => ({
        status,
        count,
      }));
    } catch (error) {
      console.error('Error fetching subscription status data:', error);
      return [];
    }
  },
};
