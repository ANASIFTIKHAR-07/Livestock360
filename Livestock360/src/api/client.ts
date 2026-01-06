import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getItem, setItem, removeItem, multiRemove } from '../utils/storage';
import { API_BASE_URL } from '@env';


const REFRESH_KEY = '@refresh_token';
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

// Typed API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Declare process for environment variables
declare const process: {
  env: {
    API_BASE_URL?: string;
    REACT_APP_API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
};

// Get base URL from environment variable
const BASE_URL = API_BASE_URL || 'http://192.168.18.202:8000/api';

console.log('🌐 API Base URL:', BASE_URL);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CRITICAL: Prevent infinite refresh loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle 401 Unauthorized with token refresh
      if (status === 401 && originalRequest && !originalRequest._retry) {
        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return apiClient.request(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        // Mark this request as retried
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const storedRefresh = await getItem(REFRESH_KEY);
          
          if (!storedRefresh) {
            throw new Error('No refresh token available');
          }

          console.log('🔄 Attempting token refresh...');

          // Call refresh token API
          const res = await axios.post(`${BASE_URL}/v1/users/refresh-token`, {
            refreshToken: storedRefresh
          });

          const newToken = res.data.data?.accessToken;
          const newRefresh = res.data.data?.refreshToken;

          if (!newToken) {
            throw new Error('No access token in refresh response');
          }

          console.log('✅ Token refreshed successfully');

          // Save new tokens
          await setItem(TOKEN_KEY, newToken);
          if (newRefresh) {
            await setItem(REFRESH_KEY, newRefresh);
          }

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Process queued requests
          processQueue(null, newToken);
          isRefreshing = false;

          // Retry the original request
          return apiClient.request(originalRequest);

        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          
          // Clear queue with error
          processQueue(refreshError, null);
          isRefreshing = false;

          // Clear all auth data
          await multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);

          // Reject with clear logout signal
          return Promise.reject({
            ...error,
            message: 'Session expired. Please login again.',
            shouldLogout: true,
          });
        }
      }

      // Handle other status codes
      switch (status) {
        case 403:
          return Promise.reject({
            ...error,
            message: 'Access denied. You do not have permission.',
            status,
          });
        case 404:
          return Promise.reject({
            ...error,
            message: 'Resource not found.',
            status,
          });
        case 500:
          return Promise.reject({
            ...error,
            message: 'Server error. Please try again later.',
            status,
          });
        default:
          break;
      }

      // Return structured error response
      return Promise.reject({
        ...error,
        message: data?.message || error.message || 'An error occurred',
        status,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      return Promise.reject({
        ...error,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

// Export the axios instance
export default apiClient;

// Export helper function to set auth token
export const setAuthToken = async (token: string | null): Promise<void> => {
  try {
    if (token) {
      await setItem(TOKEN_KEY, token);
    } else {
      await removeItem(TOKEN_KEY);
    }
  } catch (error) {
    throw error;
  }
};

// Export helper function to get auth token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};