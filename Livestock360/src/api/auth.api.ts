// src/api/auth.api.ts
import axios from './client';
// import { API_CONFIG } from '../config/api.config';

export interface User {
  _id?: string;
  userName: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  refreshToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  loggedInUser: User;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// --------------------
// API Functions
// --------------------
export const login = async (payload: LoginPayload) => {
    const res = await axios.post<APIResponse<AuthResponse>>('/v1/users/login', payload);
    return res.data;
  };
  
  export const register = async (payload: User) => {
    const res = await axios.post<APIResponse<User>>('/v1/users/register', payload);
    return res.data;
  };
  
  export const refreshToken = async (token: string) => {
    const res = await axios.post<APIResponse<AuthResponse>>('/v1/users/refresh-token', { refreshToken: token });
    return res.data;
  };

  export const getCurrentUser = async (): Promise<APIResponse<User>> => {
    const res = await axios.get<APIResponse<User>>('/v1/users/me');
    return res.data;
  };