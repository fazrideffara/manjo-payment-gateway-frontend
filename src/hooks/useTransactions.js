import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '../api/transactionApi';

export function useTransactions(filters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionApi.getAllTransactions(filters),
    staleTime: 30000, // Data dianggap fresh selama 30 detik
    retry: 2,
    refetchInterval: 10000, // Auto-refresh setiap 10 detik
  });
}

export function useTransactionDetail(referenceNumber) {
  return useQuery({
    queryKey: ['transaction', referenceNumber],
    queryFn: () => transactionApi.getTransactionByRef(referenceNumber),
    enabled: !!referenceNumber,
  });
}
