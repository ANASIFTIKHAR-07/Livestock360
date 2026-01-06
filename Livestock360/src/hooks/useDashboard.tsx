// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { getDashboardOverview, DashboardOverview, APIResponse } from '../api/dashboard.api';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res: APIResponse<DashboardOverview> = await getDashboardOverview();
      setData(res.data);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
};

// // src/hooks/useDashboard.ts
// import { useState, useEffect, useCallback } from 'react';
// import { getDashboardOverview, DashboardOverview, APIResponse } from '../api/dashboard.api';

// export const useDashboard = () => {
//   const [data, setData] = useState<DashboardOverview | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDashboard = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res: APIResponse<DashboardOverview> = await getDashboardOverview();
//       setData(res.data);
//     } catch (err: any) {
//       console.error('Dashboard fetch error:', err);
//       setError(err?.message || 'Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   return {
//     data,
//     loading,
//     error,
//     refetch: fetchDashboard,
//   };
// };