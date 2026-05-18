import axiosClient from '../utils/axiosClient';

const newsApi = {
  subscribe: (email) => {
    return axiosClient.post('/newsletter/subscribe', { email: email.trim() });
  },

  getSubscribers: () => {
    return axiosClient.get('/newsletter/subscribers');
  }
};

export default newsApi;
