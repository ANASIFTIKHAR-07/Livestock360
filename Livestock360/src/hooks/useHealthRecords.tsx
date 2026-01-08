// src/hooks/useHealthRecords.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  getHealthRecords,
  getHealthRecordById as apiGetHealthRecordById,
  createHealthRecord as apiCreateHealthRecord,
  updateHealthRecord as apiUpdateHealthRecord,
  deleteHealthRecord as apiDeleteHealthRecord,
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
      console.log('✅ Health records fetched:', res.data.records?.length);
      setRecords(res.data.records || []);
    } catch (err: any) {
      console.error('❌ useHealthRecords fetchRecords error:', err);
      setError(err?.message || 'Failed to load health records');
      setRecords([]);
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
      const allUpcoming = [...(res.data.upcoming || []), ...(res.data.overdue || [])];
      setUpcomingRecords(allUpcoming);
    } catch (err: any) {
      console.error('❌ useHealthRecords fetchUpcomingRecords error:', err);
      setError(err?.message || 'Failed to load upcoming records');
      setUpcomingRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ✅ Wrap in useCallback
  const getHealthRecordById = useCallback(async (id: string): Promise<HealthRecord | null> => {
    try {
      const res: APIResponse<HealthRecord> = await apiGetHealthRecordById(id);
      return res.data;
    } catch (err) {
      console.error('❌ useHealthRecords getHealthRecordById error:', err);
      return null;
    }
  }, []);

  // ✅ Wrap in useCallback
  const createHealthRecord = useCallback(async (data: HealthRecordCreatePayload): Promise<void> => {
    try {
      await apiCreateHealthRecord(data);
      await fetchRecords();
    } catch (err) {
      console.error('❌ useHealthRecords createHealthRecord error:', err);
      throw err;
    }
  }, [fetchRecords]);

  // ✅ Wrap in useCallback
  const updateHealthRecord = useCallback(async (id: string, data: HealthRecordUpdatePayload): Promise<void> => {
    try {
      await apiUpdateHealthRecord(id, data);
      await fetchRecords();
    } catch (err) {
      console.error('❌ useHealthRecords updateHealthRecord error:', err);
      throw err;
    }
  }, [fetchRecords]);

  // ✅ NEW: Delete health record
  const deleteHealthRecord = useCallback(async (id: string): Promise<void> => {
    try {
      await apiDeleteHealthRecord(id);
      console.log('✅ Health record deleted successfully');
      await fetchRecords(); // Refresh the list after deletion
    } catch (err) {
      console.error('❌ useHealthRecords deleteHealthRecord error:', err);
      throw err;
    }
  }, [fetchRecords]);

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
    deleteHealthRecord, // ✅ Added to return object
  };
};