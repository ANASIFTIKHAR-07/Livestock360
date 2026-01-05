import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const BASE_URL = (process?.env?.API_BASE_URL || process?.env?.REACT_APP_API_BASE_URL || 'http://localhost:5000/api') as string;

// Token storage key
const TOKEN_KEY = '@auth_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Error retrieving auth token
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
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          try {
            await AsyncStorage.removeItem(TOKEN_KEY);
          } catch {
            // Error clearing auth token
          }
          // You can emit an event or handle logout here
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          // API Error
          break;
      }

      // Return a structured error response
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
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    throw error;
  }
};

// Export helper function to get auth token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

