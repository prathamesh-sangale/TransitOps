import httpClient from '../../../services/httpClient';

export const financeApi = {
  getExpenses: (params) => httpClient.get('/expenses', { params }).then(res => res.data),
  createExpense: (data) => httpClient.post('/expenses', data).then(res => res.data),

  getFuelLogs: (params) => httpClient.get('/fuel', { params }).then(res => res.data),
  createFuelLog: (data) => httpClient.post('/fuel', data).then(res => res.data),
};
