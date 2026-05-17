import axiosClient from '../utils/axiosClient';

const orderApi = {
  getAll: (params) => {
    return axiosClient.get('/orders', { params });
  },

  getByNumber: (orderNumber) => {
    return axiosClient.get(`/orders/${orderNumber}`);
  },

  create: (data) => {
    return axiosClient.post('/orders', data);
  },

  updateStatus: (orderNumber, status) => {
    return axiosClient.put(`/orders/${orderNumber}/status`, { status });
  }
};

export default orderApi;
