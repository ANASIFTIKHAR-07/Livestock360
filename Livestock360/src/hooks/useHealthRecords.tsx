// src/hooks/useHealthRecords.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  getHealthRecords,
  getHealthRecordById as apiGetHealthRecordById,
  createHealthRecord as apiCreateHealthRecord,
  updateHealthRecord as apiUpdateHealthRecord,
  getUpcomingRecords as apiGetUpcomingRecords,
  HealthRecord,
  HealthRecordCreatePayload,
  HealthRecordUpdatePayload,
  APIResponse,
} from '../api/health.api';

export const useHealthRecords = (initialFilters?: Record<string, any>) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [upcomingRecords, setUpcomingRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters || {});

  // Fetch all health records with optional filters
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHealthRecords(filters);
      setRecords(res.data.records);
    } catch (err: any) {
      console.error('useHealthRecords fetchRecords error:', err);
      setError(err?.message || 'Failed to load health records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch upcoming & overdue health records
  const fetchUpcomingRecords = useCallback(async (days: number = 30) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetUpcomingRecords(days);
      const allUpcoming = [...res.data.upcoming, ...res.data.overdue];
      setUpcomingRecords(allUpcoming);
    } catch (err: any) {
      console.error('useHealthRecords fetchUpcomingRecords error:', err);
      setError(err?.message || 'Failed to load upcoming records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Get a single health record by ID
  const getHealthRecordById = async (id: string): Promise<HealthRecord | null> => {
    try {
      const res: APIResponse<HealthRecord> = await apiGetHealthRecordById(id);
      return res.data;
    } catch (err) {
      console.error('useHealthRecords getHealthRecordById error:', err);
      return null;
    }
  };

  // Create a new health record
  const createHealthRecord = async (data: HealthRecordCreatePayload): Promise<void> => {
    try {
      await apiCreateHealthRecord(data);
      await fetchRecords(); // Refresh after creation
    } catch (err) {
      console.error('useHealthRecords createHealthRecord error:', err);
      throw err;
    }
  };

  // Update an existing health record
  const updateHealthRecord = async (id: string, data: HealthRecordUpdatePayload): Promise<void> => {
    try {
      await apiUpdateHealthRecord(id, data);
      await fetchRecords(); // Refresh after update
    } catch (err) {
      console.error('useHealthRecords updateHealthRecord error:', err);
      throw err;
    }
  };

  return {
    records,
    upcomingRecords,
    loading,
    error,
    refetch: fetchRecords,
    refetchUpcoming: fetchUpcomingRecords,
    setFilters,
    getHealthRecordById,
    createHealthRecord,
    updateHealthRecord,
  };
};
