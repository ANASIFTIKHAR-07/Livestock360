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

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// --------------------
// API Functions
// --------------------
export const getAnimals = async (filters?: Record<string, any>) => {
  const res = await axios.get<APIResponse<Animal[]>>('/animals', { params: filters });
  return res.data;
};

export const getAnimalById = async (id: string) => {
  const res = await axios.get<APIResponse<Animal>>(`/animals/${id}`);
  return res.data;
};

export const createAnimal = async (payload: Animal) => {
  const res = await axios.post<APIResponse<Animal>>('/animals', payload);
  return res.data;
};

export const updateAnimal = async (id: string, payload: Partial<Animal>) => {
  const res = await axios.put<APIResponse<Animal>>(`/animals/${id}`, payload);
  return res.data;
};

export const deleteAnimal = async (id: string) => {
  const res = await axios.delete<APIResponse<null>>(`/animals/${id}`);
  return res.data;
};
