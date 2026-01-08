// src/utils/statusMapping.ts
import { Status } from '../components/common/StatusBadge';
import { HealthRecord } from '../api/health.api';

export const mapHealthStatusToBadge = (status?: HealthRecord['status']): Status => {
  switch (status) {
    case 'Completed': 
      return 'Healthy';
    case 'Scheduled': 
      return 'Attention';
    case 'Overdue': 
      return 'Critical';
    case 'Cancelled': 
      return 'Inactive'; // ✅ Now mapped to 'Inactive' instead of 'Unknown'
    default: 
      return 'Unknown';
  }
};