// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authApi from "../api/auth.api";

// --------------------
// Types
// --------------------
export interface User {
  _id?: string;
  userName: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// --------------------
// AsyncStorage Keys
// --------------------
const ACCESS_TOKEN_KEY = "@access_token";
const REFRESH_TOKEN_KEY = "@refresh_token";
const USER_KEY = "@auth_user";

// --------------------
// Context
// --------------------
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// --------------------
// Provider
// --------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user + tokens from AsyncStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        const storedAccess = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const storedRefresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedAccess) setAccessToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  // --------------------
  // Functions
  // --------------------
  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const response = await authApi.login(payload);
      const { accessToken, refreshToken, user } = response.data;

      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      await authApi.register(payload);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    await AsyncStorage.multiRemove([USER_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const response = await authApi.refreshToken(refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
// Hook
// --------------------
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
