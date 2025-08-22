import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardAnalytics = (corpId: number, fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: ['dashboard-analytics', corpId, fromDate, toDate],
    queryFn: () => dashboardService.getAnalytics(corpId, fromDate, toDate),
    enabled: !!corpId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};