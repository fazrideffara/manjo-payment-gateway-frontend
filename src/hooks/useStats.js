import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '../api/transactionApi';

export function useStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => transactionApi.getStats(),
    refetchInterval: 5000, // Refresh setiap 5 detik agar real-time banget
  });
}
