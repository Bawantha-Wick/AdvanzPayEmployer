import api from './api';
import type { AnalyticsData, AnalyticsResponse } from '../types/api';

export const settlementService = {
  getAnalytics: async (corpId: number, fromDate: string, toDate: string): Promise<AnalyticsData> => {
    try {
      const url = `/corp/analytics?corpId=${corpId}&from=${fromDate}&to=${toDate}`;
      const response = await api.get<AnalyticsResponse>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching settlement analytics:', error);
      throw error;
    }
  }
};
