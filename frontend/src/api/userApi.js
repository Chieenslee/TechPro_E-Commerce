import axiosClient from '../utils/axiosClient';

const userApi = {
  getAll: (params) => {
    return axiosClient.get('/users', { params });
  },

  update: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
  },

  getAddresses: (userId) => {
    return axiosClient.get(`/users/${userId}/addresses`);
  },

  saveAddress: (userId, data) => {
    return axiosClient.post(`/users/${userId}/addresses`, data);
  },

  deleteAddress: (userId, addressId) => {
    return axiosClient.delete(`/users/${userId}/addresses/${addressId}`);
  },

  getWishlist: (userId) => {
    return axiosClient.get(`/users/${userId}/wishlist`);
  },

  saveWishlist: (userId, productIds) => {
    return axiosClient.put(`/users/${userId}/wishlist`, { productIds });
  },

  removeWishlistItem: (userId, productId) => {
    return axiosClient.delete(`/users/${userId}/wishlist/${productId}`);
  }
};

export default userApi;
