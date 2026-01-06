// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api"; // Using aggregator

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
  loggedInUser: User;
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


  console.log('🔄 AuthProvider RENDER - loading:', loading, 'user:', user?.email || 'null');
  // Load user + tokens from AsyncStorage on mount
  useEffect(() => {
    console.log('🚀 AuthProvider useEffect TRIGGERED');
    const loadAuth = async () => {
      try {
        console.log('📦 Loading auth from AsyncStorage...');
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        const storedAccess = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const storedRefresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        console.log('✅ Storage loaded:', {
          hasUser: !!storedUser,
          hasAccess: !!storedAccess,
          hasRefresh: !!storedRefresh
        });


        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedAccess) setAccessToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        console.log('✅✅✅ SETTING LOADING TO FALSE ✅✅✅');
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  // --------------------
  // Functions
  // --------------------
 // src/context/AuthContext.tsx

const login = async (payload: LoginPayload) => {
  setLoading(true);
  try {
    const response = await authApi.login(payload);
    
    console.log('📥 Login response:', JSON.stringify(response, null, 2));
    
    // response structure: { success: true, data: { accessToken, refreshToken, loggedInUser }, message: "..." }
    // So the actual tokens and user are in response.data
    const { accessToken, refreshToken, loggedInUser } = response.data;

    if (!accessToken || !loggedInUser) {
      throw new Error('Invalid response from server');
    }

    console.log('✅ Setting user:', loggedInUser);

    setUser(loggedInUser);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    // Also save to keys used by API client
    await AsyncStorage.setItem('@auth_token', accessToken);
    await AsyncStorage.setItem('@refresh_token', refreshToken);
    
    console.log('✅ Login successful!');
  } catch (error: any) {
    console.error('❌ Login error:', error);
    throw new Error(error?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await authApi.register(payload);
      console.log('✅ Registration successful:', response);
      // Don't set user here, will be done in login
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw new Error(error?.message || "Registration failed");
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
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data || {};

      if (!newAccessToken) throw new Error("Invalid refresh response");

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    } catch (error: any) {
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
