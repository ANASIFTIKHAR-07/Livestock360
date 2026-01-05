// // src/api/health.api.ts
// import axios from './client';
// // import { API_CONFIG } from '../config/api.config';
// import { Animal } from './animal.api';


// export interface HealthRecord {
//     _id?: string;
//     animalId: string; // always DB field
//     populatedAnimal?: Pick<Animal, '_id' | 'tagNumber' | 'name' | 'type' | 'photo'>; // optional populated data
//     userId: string;
//     type: 'Vaccination' | 'Treatment' | 'Checkup' | 'Deworming' | 'Surgery' | 'Other';
//     title: string;
//     description?: string;
//     date: string;
//     nextDueDate?: string;
//     veterinarian?: string;
//     cost?: number;
//     medicine?: string;
//     dosage?: string;
//     photo?: string;
//     status?: 'Completed' | 'Scheduled' | 'Overdue' | 'Cancelled';
//     notes?: string;
//     createdAt?: string;
//     updatedAt?: string;
  
//     // Virtuals
//     daysUntilDue?: {
//       days: number;
//       isOverdue: boolean;
//       isDueToday: boolean;
//       isDueSoon: boolean;
//     };
//     isOverdueVirtual?: boolean;
//   }
  


// export interface APIResponse<T> {
//   data: T;
//   message?: string;
//   success: boolean;
// }

// // --------------------
// // API Functions
// // --------------------
// export const getHealthRecords = async (filters?: Record<string, any>) => {
//   const res = await axios.get<APIResponse<HealthRecord[]>>('/health-records', { params: filters });
//   return res.data;
// };

// export const getHealthRecordById = async (id: string) => {
//   const res = await axios.get<APIResponse<HealthRecord>>(`/health-records/${id}`);
//   return res.data;
// };

// export const createHealthRecord = async (payload: HealthRecord) => {
//   const res = await axios.post<APIResponse<HealthRecord>>('/health-records', payload);
//   return res.data;
// };

// export const updateHealthRecord = async (id: string, payload: Partial<HealthRecord>) => {
//   const res = await axios.put<APIResponse<HealthRecord>>(`/health-records/${id}`, payload);
//   return res.data;
// };

// export const deleteHealthRecord = async (id: string) => {
//   const res = await axios.delete<APIResponse<null>>(`/health-records/${id}`);
//   return res.data;
// };

// src/api/health.api.ts
import axios from './client';
import { Animal } from './animal.api';

// --------------------
// TypeScript Interfaces
// --------------------
export interface HealthRecord {
    _id?: string;
    animalId: string; // always DB field
    populatedAnimal?: Pick<Animal, '_id' | 'tagNumber' | 'name' | 'type' | 'photo'>; // optional populated data
    userId: string;
    type: 'Vaccination' | 'Treatment' | 'Checkup' | 'Deworming' | 'Surgery' | 'Other';
    title: string;
    description?: string;
    date: string;
    nextDueDate?: string;
    veterinarian?: string;
    cost?: number;
    medicine?: string;
    dosage?: string;
    photo?: string;
    status?: 'Completed' | 'Scheduled' | 'Overdue' | 'Cancelled';
    notes?: string;
    createdAt?: string;
    updatedAt?: string;

    // Virtuals
    daysUntilDue?: {
      days: number;
      isOverdue: boolean;
      isDueToday: boolean;
      isDueSoon: boolean;
    };
    isOverdueVirtual?: boolean;
}

// Payloads for API requests
export interface HealthRecordCreatePayload {
    animalId: string;
    userId: string;
    type: HealthRecord['type'];
    title: string;
    description?: string;
    date: string;
    nextDueDate?: string;
    veterinarian?: string;
    cost?: number;
    medicine?: string;
    dosage?: string;
    photo?: string;
    status?: HealthRecord['status'];
    notes?: string;
}

export interface HealthRecordUpdatePayload extends Partial<HealthRecordCreatePayload> {}

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// --------------------
// API Functions
// --------------------
export const getHealthRecords = async (filters?: Record<string, any>) => {
  const res = await axios.get<APIResponse<HealthRecord[]>>('/health-records', { params: filters });
  return res.data;
};

export const getHealthRecordById = async (id: string) => {
  const res = await axios.get<APIResponse<HealthRecord>>(`/health-records/${id}`);
  return res.data;
};

export const createHealthRecord = async (payload: HealthRecordCreatePayload) => {
  const res = await axios.post<APIResponse<HealthRecord>>('/health-records', payload);
  return res.data;
};

export const updateHealthRecord = async (id: string, payload: HealthRecordUpdatePayload) => {
  const res = await axios.put<APIResponse<HealthRecord>>(`/health-records/${id}`, payload);
  return res.data;
};

export const deleteHealthRecord = async (id: string) => {
  const res = await axios.delete<APIResponse<null>>(`/health-records/${id}`);
  return res.data;
};
