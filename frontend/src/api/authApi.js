import axiosClient from '../utils/axiosClient';

const authApi = {
  login: (data) => {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },
  
  register: (data) => {
    const url = '/auth/register';
    return axiosClient.post(url, data);
  },
  
  getProfile: () => {
    const url = '/auth/profile';
    return axiosClient.get(url);
  }
};

export default authApi;
