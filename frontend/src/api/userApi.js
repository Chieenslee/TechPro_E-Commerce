import axiosClient from '../utils/axiosClient';

const userApi = {
  getAll: (params) => {
    return axiosClient.get('/users', { params });
  },

  update: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
  }
};

export default userApi;
