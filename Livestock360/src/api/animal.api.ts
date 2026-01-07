// src/api/animal.api.ts
import axios from './client';

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

// Backend gets userId from req.user._id (auth token), so DON'T include it here
export interface CreateAnimalPayload {
  tagNumber: string;
  name?: string;
  type: 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Camel' | 'Other';
  gender: 'Male' | 'Female';
  birthDate: string;
  breed?: string;
  weight?: number;
  notes?: string;
  // status: 'Healthy' | 'Attention' | 'Critical' | 'Unknown' ; 
}

// React Native file format
export interface RNFileUpload {
  uri: string;
  type: string;
  name: string;
}

export interface APIResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
  success: boolean;
}

export interface GetAnimalsResponse {
  animals: Animal[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAnimals: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// --------------------
// API Functions
// --------------------
export const getAnimals = async (filters?: Record<string, any>) => {
  try {
    const res = await axios.get<APIResponse<GetAnimalsResponse>>('/v1/animals', { params: filters });
    console.log('✅ API: Animals fetched successfully, count:', res.data.data.animals?.length);
    return res.data;
  } catch (error: any) {
    console.error('❌ API: getAnimals error:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch animals');
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
  file?: RNFileUpload
) => {
  try {
    // Create FormData instance
    const formData = new FormData();
    
    // Append required fields
    formData.append('tagNumber', payload.tagNumber);
    formData.append('type', payload.type);
    formData.append('gender', payload.gender);
    formData.append('birthDate', payload.birthDate);
    // formData.append('status', payload.status); 
    
    // Append optional fields (only if they have values)
    if (payload.name) formData.append('name', payload.name);
    if (payload.breed) formData.append('breed', payload.breed);
    if (payload.weight) formData.append('weight', payload.weight.toString());
    if (payload.notes) formData.append('notes', payload.notes);
    
    // Append photo file (React Native format)
    if (file) {
      // @ts-ignore - React Native's FormData accepts this format
      formData.append('photo', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    console.log('📤 Creating animal:', payload.tagNumber);

    // Make POST request
    const res = await axios.post<APIResponse<Animal>>('/v1/animals', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Animal created successfully');
    return res.data;
    
  } catch (error: any) {
    console.error('❌ createAnimal ERROR:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    
    // Handle specific errors
    if (!error?.response) {
      throw new Error('Network error. Check your connection and backend server');
    }
    
    if (error?.response?.status === 401) {
      throw new Error('Authentication failed. Please login again');
    }
    
    if (error?.response?.status === 409) {
      throw new Error('Tag number already exists');
    }
    
    throw new Error(
      error?.response?.data?.message || 
      error?.message || 
      'Failed to create animal'
    );
  }
};

export const updateAnimal = async (id: string, payload: Partial<Animal>, file?: RNFileUpload) => {
  try {
    const formData = new FormData();
    
    // Handle each field properly - skip virtual and readonly fields
    Object.entries(payload).forEach(([key, value]) => {
      // Skip fields that shouldn't be updated
      if (key === 'age' || key === '_id' || key === 'userId' || key === 'createdAt' || key === 'updatedAt' || key === 'isActive') {
        return;
      }
      
      if (value !== undefined && value !== null) {
        // Convert to appropriate type for FormData
        if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'string') {
          formData.append(key, value);
        }
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

    console.log('📤 Updating animal ID:', id);
    console.log('📦 Update payload:', payload);
    console.log('📋 Status being sent:', payload.status);

    const res = await axios.put<APIResponse<Animal>>(`/v1/animals/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    console.log('✅ Animal updated successfully');
    console.log('📥 Updated animal status from server:', res.data.data?.status);
    
    return res.data;
  } catch (error: any) {
    console.error('❌ updateAnimal ERROR:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to update animal');
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

export const getAnimalStats = async () => {
  try {
    const res = await axios.get<APIResponse<any>>('/v1/animals/stats');
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch animal statistics');
  }
};