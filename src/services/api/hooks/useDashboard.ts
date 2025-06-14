import { useQuery } from '@tanstack/react-query';
import { dashboardApi, DashboardData, DashboardInventoryData } from '../dashboard';

export const useDashboard = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
  });
}; 

export const useDashboardInventory = () => {
  return useQuery<DashboardInventoryData, Error>({
    queryKey: ['dashboardInventory'],
    queryFn: dashboardApi.getInventory,
  });
}; 