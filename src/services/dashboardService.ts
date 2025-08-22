import api from './api';

export interface DailyWithdrawal {
  date: string;
  amount: number;
}

export interface DashboardAnalytics {
  employeeCount: number;
  totalWithdrawalAmount: number;
  withdrawalRequestCount: number;
  totalLiability: number;
  dailyWithdrawals: DailyWithdrawal[];
}

export interface DashboardResponse {
  statusCode: number;
  status: boolean;
  responseCode: string;
  message: string;
  data: DashboardAnalytics;
}

export const dashboardService = {
  getAnalytics: async (corpId: number, fromDate?: string, toDate?: string): Promise<DashboardAnalytics> => {
    try {
      let url = `/corp/analytics?corpId=${corpId}`;

      if (fromDate && toDate) {
        url += `&from=${fromDate}&to=${toDate}`;
      }

      const response = await api.get<DashboardResponse>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }
};