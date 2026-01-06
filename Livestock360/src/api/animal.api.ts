// src/api/animals.api.ts
import axios from './client';
// import { API_CONFIG } from '../config/api.config';

// --------------------
// TypeScript Interfaces
// --------------------
export interface Animal {
    _id?: string;
    userId: string;
    tagNumber: string;
    name?: string;
    type: 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Camel' | 'Other';
    breed?: string;
    gender: 'Male' | 'Female';
    birthDate: string;
    weight?: number;
    status?: 'Healthy' | 'Attention' | 'Critical' | 'Unknown';
    notes?: string;
    isActive?: boolean;
    lastCheckupDate?: string;
    createdAt?: string;
    updatedAt?: string;
  
    photo?: string; 
  
    age?: {
      years: number;
      months: number;
      totalMonths: number;
    };
  }

  export interface CreateAnimalPayload {
    tagNumber: string;
    name?: string;
    type: 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Camel' | 'Other';
    gender: 'Male' | 'Female';
    userId: string;
    birthDate: string;
    breed?: string;
    weight?: number;
    notes?: string;
  }
  

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// --------------------
// API Functions
// --------------------
export const getAnimals = async (filters?: Record<string, any>) => {
    try {
      const res = await axios.get<APIResponse<Animal[]>>('/v1/animals', { params: filters });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch animals');
    }
  };

export const getAnimalById = async (id: string) => {
    try {
      const res = await axios.get<APIResponse<Animal>>(`/v1/animals/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch animal');
    }
  };

  export const createAnimal = async (
    payload: CreateAnimalPayload,
    file?: File
  ) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value as any);
      });
      if (file) formData.append('photo', file);
  
      const res = await axios.post<APIResponse<Animal>>('/v1/animals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create animal');
    }
  };

// Update animal (with optional new photo)
export const updateAnimal = async (id: string, payload: Partial<Animal>, file?: File) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value as any);
      });
      if (file) formData.append('photo', file);
  
      const res = await axios.put<APIResponse<Animal>>(`/v1/animals/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to update animal');
    }
  };

export const deleteAnimal = async (id: string) => {
    try {
      const res = await axios.delete<APIResponse<null>>(`/v1/animals/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to delete animal');
    }
  };


  // Get animal statistics
export const getAnimalStats = async () => {
    try {
      const res = await axios.get<APIResponse<any>>('/v1/animals/stats');
      return res.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch animal statistics');
    }
  };