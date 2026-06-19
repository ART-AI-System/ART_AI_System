import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create an Axios instance with base URL from environment variables
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the access token to every request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap Common Response Format or catch Common Error Format
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the backend wraps data in { message, data, meta }, we can return just the data payload if we want,
    // or return the whole response.data so the caller can access meta and message.
    // For this setup, we return the entire response.data object.
    return response.data;
  },
  (error) => {
    // Attempt to extract the common error format sent by the backend
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const errors = error.response?.data?.errors || [];
    
    // Create a normalized error object
    const normalizedError = {
      message: errorMessage,
      errors: errors,
      status: error.response?.status
    };
    
    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
