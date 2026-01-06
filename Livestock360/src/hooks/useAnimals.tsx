// src/hooks/useAnimals.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  getAnimals, 
  getAnimalById as apiGetAnimalById, 
  updateAnimal as apiUpdateAnimal, 
  Animal, 
  APIResponse 
} from '../api/animal.api';

export const useAnimals = (initialFilters?: Record<string, any>) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters || {});

  // Fetch animal list
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

  // Get a single animal by ID
  const getAnimalById = async (id: string): Promise<Animal | null> => {
    try {
      const res: APIResponse<Animal> = await apiGetAnimalById(id);
      return res.data;
    } catch (err) {
      console.error('getAnimalById error:', err);
      return null;
    }
  };

  // Update an animal
  const updateAnimal = async (id: string, data: Partial<Animal>): Promise<void> => {
    try {
      await apiUpdateAnimal(id, data);
      await fetchAnimals(); // refresh list after update
    } catch (err: any) {
      console.error('updateAnimal error:', err);
      throw err;
    }
  };

  return {
    animals,
    loading,
    error,
    refetch: fetchAnimals,
    setFilters,
    getAnimalById,
    updateAnimal,
  };
};
