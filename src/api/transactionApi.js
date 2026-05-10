import api from './axios';

export const transactionApi = {
  getAllTransactions: async (filters) => {
    const { page = 0, size = 10, status = 'ALL' } = filters;
    const { data } = await api.get('/v1/admin/transactions', { 
      params: { page, size, status } 
    });
    return data;
  },
  
  getStats: async () => {
    const { data } = await api.get('/v1/admin/stats');
    return data;
  },

  getTransactionByRef: async (ref) => {
    const { data } = await api.get(`/v1/admin/transactions/${ref}`);
    return data;
  },
  
  updateProfile: async (profileData) => {
    const { data } = await api.put('/v1/auth/profile', profileData);
    return data;
  }
};
