// src/hooks/useAnimals.tsx
import { useState, useEffect, useCallback } from 'react';
import { getAnimals, Animal, APIResponse } from '../api/animal.api';

export const useAnimals = (initialFilters?: Record<string, any>) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters || {});

  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: APIResponse<Animal[]> = await getAnimals(filters);
      setAnimals(res.data);
    } catch (err: any) {
      console.error('useAnimals error:', err);
      setError(err?.message || 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  return {
    animals,
    loading,
    error,
    refetch: fetchAnimals,
    setFilters,
  };
};


