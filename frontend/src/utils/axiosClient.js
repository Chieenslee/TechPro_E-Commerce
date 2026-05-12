import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: 'https://localhost:7099/api', // Backend ASP.NET Core URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for requests
axiosClient.interceptors.request.use(
  (config) => {
    // Attach token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for responses
axiosClient.interceptors.response.use(
  (response) => {
    // Only return the data part
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Unauthorized: clear token and redirect to login
      // localStorage.removeItem('access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
