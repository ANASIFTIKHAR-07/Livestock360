// src/hooks/useHealthRecords.tsx
import { useState, useEffect, useCallback } from 'react';
import { getHealthRecords, HealthRecord, APIResponse } from '../api/health.api';

export const useHealthRecords = (initialFilters?: Record<string, any>) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters || {});

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: APIResponse<HealthRecord[]> = await getHealthRecords(filters);
      setRecords(res.data);
    } catch (err: any) {
      console.error('useHealthRecords error:', err);
      setError(err?.message || 'Failed to load health records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
    setFilters,
  };
};


