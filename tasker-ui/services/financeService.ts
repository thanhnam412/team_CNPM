import api from "./api";

export const financeService = {
  getTransactions: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}/finance/transactions`);
    return data;
  },

  createTransaction: async (userId: string, payload: any) => {
    const { data } = await api.post(
      `/users/${userId}/finance/transactions`,
      payload,
    );
    return data;
  },
};
