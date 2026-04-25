import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types/index';

/**
 * Configured Axios instance for all backend API calls.
 * Uses the Vite proxy in development (/api → http://localhost:8080).
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalises error shapes
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.error ??
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.');
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
