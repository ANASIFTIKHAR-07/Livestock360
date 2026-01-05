// src/api/dashboard.api.ts
import axios from './client';
// import { API_CONFIG } from '../config/api.config';
import { Animal } from './animal.api';
import { HealthRecord } from './health.api';

// --------------------
// TypeScript Interfaces
// --------------------
export interface DashboardOverview {
  animals: {
    total: number;
    healthy: number;
    needAttention: number;
    critical: number;
    unknown: number;
  };
  upcomingVaccinations: {
    id: string;
    animal: Pick<Animal, '_id' | 'tagNumber' | 'name' | 'type' | 'photo'> | null;
    type: HealthRecord['type'];
    title: string;
    dueDate: string;
    daysUntil: number;
  }[];
  alerts: {
    overdueCount: number;
    needsAttentionCount: number;
  };
  recentActivity: {
    type: 'animal_added' | 'health_record_added';
    data: any;
    timestamp: string;
  }[];
  statistics: {
    totalHealthRecords: number;
    recordsThisMonth: number;
  };
  needsAttention: Pick<Animal, '_id' | 'tagNumber' | 'name' | 'type' | 'status' | 'photo'>[];
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// --------------------
// API Functions
// --------------------
export const getDashboardOverview = async (): Promise<APIResponse<DashboardOverview>> => {
  const res = await axios.get<APIResponse<DashboardOverview>>('/dashboard/overview');
  return res.data;
};
