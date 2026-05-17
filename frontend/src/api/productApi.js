import axiosClient from '../utils/axiosClient';

const productApi = {
  getAll: (params) => {
    // params can contain query filters, pagination, etc.
    const url = '/products';
    return axiosClient.get(url, { params });
  },
  
  getById: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  getReviews: (id) => {
    const url = `/products/${id}/reviews`;
    return axiosClient.get(url);
  },

  createReview: (id, data) => {
    const url = `/products/${id}/reviews`;
    return axiosClient.post(url, data);
  },
  
  // Future Admin Endpoints
  create: (data) => {
    const url = '/products';
    return axiosClient.post(url, data);
  },
  update: (id, data) => {
    const url = `/products/${id}`;
    return axiosClient.put(url, data);
  },
  remove: (id) => {
    const url = `/products/${id}`;
    return axiosClient.delete(url);
  }
};

export default productApi;
