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
  animalId: string; // DB field
  populatedAnimal?: Pick<Animal, '_id' | 'tagNumber' | 'name' | 'type' | 'photo'>;
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

// Get all health records (with optional filters)
export const getHealthRecords = async (filters?: Record<string, any>) => {
  try {
    const res = await axios.get<APIResponse<{ records: HealthRecord[]; pagination: any }>>(
      '/v1/health-records',
      { params: filters }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch health records');
  }
};

// Get a single record by ID
export const getHealthRecordById = async (id: string) => {
  try {
    const res = await axios.get<APIResponse<HealthRecord>>(`/v1/health-records/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch health record');
  }
};

// Create a new health record
export const createHealthRecord = async (payload: HealthRecordCreatePayload, file?: File) => {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value as any);
    });
    if (file) formData.append('photo', file);

    const res = await axios.post<APIResponse<HealthRecord>>('/v1/health-records', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to create health record');
  }
};

// Update a health record
export const updateHealthRecord = async (id: string, payload: HealthRecordUpdatePayload, file?: File) => {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value as any);
    });
    if (file) formData.append('photo', file);

    const res = await axios.put<APIResponse<HealthRecord>>(`/v1/health-records/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to update health record');
  }
};

// Delete a health record
export const deleteHealthRecord = async (id: string) => {
  try {
    const res = await axios.delete<APIResponse<null>>(`/v1/health-records/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to delete health record');
  }
};

// Get upcoming records (default 30 days)
export const getUpcomingRecords = async (days: number = 30) => {
  try {
    const res = await axios.get<APIResponse<{
      upcoming: HealthRecord[];
      overdue: HealthRecord[];
      counts: {
        dueToday: number;
        dueThisWeek: number;
        dueThisMonth: number;
        overdue: number;
      };
    }>>(`/v1/health-records/upcoming`, { params: { days } });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch upcoming health records');
  }
};

// Get records for a specific animal
export const getRecordsByAnimal = async (animalId: string) => {
  try {
    const res = await axios.get<APIResponse<HealthRecord[]>>(`/v1/health-records/animal/${animalId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch health records for animal');
  }
};
