// src/api/health.api.ts
import axios from './client';
import { Animal, RNFileUpload } from './animal.api';

// --------------------
// TypeScript Interfaces
// --------------------
export interface HealthRecord {
  _id?: string;
  animalId: string;
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
  type: HealthRecord['type'];
  title: string;
  description?: string;
  date: string;
  nextDueDate?: string;
  veterinarian?: string;
  cost?: number;
  medicine?: string;
  dosage?: string;
  status?: HealthRecord['status'];
  notes?: string;
}

export interface HealthRecordUpdatePayload extends Partial<HealthRecordCreatePayload> {}

export interface APIResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
  success: boolean;
}

// --------------------
// API Functions
// --------------------

export const getHealthRecords = async (filters?: Record<string, any>) => {
  try {
    const res = await axios.get<APIResponse<{ records: HealthRecord[]; pagination: any }>>(
      '/v1/health-records',
      { params: filters }
    );
    console.log('✅ Health records fetched:', res.data.data.records?.length);
    return res.data;
  } catch (error: any) {
    console.error('❌ getHealthRecords error:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch health records');
  }
};

export const getHealthRecordById = async (id: string) => {
  try {
    console.log('📡 API: Fetching health record ID:', id);
    const res = await axios.get<APIResponse<HealthRecord>>(`/v1/health-records/${id}`);
    console.log('📡 API: Health record response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('📡 API Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch health record');
  }
};

// ✅ Fixed: Use RNFileUpload instead of File
export const createHealthRecord = async (payload: HealthRecordCreatePayload, file?: RNFileUpload) => {
  try {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    if (file) {
      // @ts-ignore - React Native FormData format
      formData.append('photo', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    console.log('📤 Creating health record:', payload.title);

    const res = await axios.post<APIResponse<HealthRecord>>('/v1/health-records', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    console.log('✅ Health record created');
    return res.data;
  } catch (error: any) {
    console.error('❌ createHealthRecord error:', error?.response?.data || error);
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to create health record');
  }
};

// ✅ Fixed: Use RNFileUpload instead of File
export const updateHealthRecord = async (id: string, payload: HealthRecordUpdatePayload, file?: RNFileUpload) => {
  try {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    if (file) {
      // @ts-ignore
      formData.append('photo', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    const res = await axios.put<APIResponse<HealthRecord>>(`/v1/health-records/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to update health record');
  }
};

export const deleteHealthRecord = async (id: string) => {
  try {
    const res = await axios.delete<APIResponse<null>>(`/v1/health-records/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to delete health record');
  }
};

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

export const getRecordsByAnimal = async (animalId: string) => {
  try {
    const res = await axios.get<APIResponse<{
      animal: Animal;
      records: HealthRecord[];
      summary: {
        totalRecords: number;
        lastCheckup: string | null;
        nextVaccination: string | null;
      };
    }>>(`/v1/health-records/animal/${animalId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch health records for animal');
  }
};