// src/utils/constants.ts

export const ANIMAL_TYPES = ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel', 'Other'] as const;
export const ANIMAL_STATUSES = ['Healthy', 'Attention', 'Critical', 'Unknown'] as const;
export const GENDERS = ['Male', 'Female'] as const;

export const HEALTH_RECORD_TYPES = [
  'Vaccination',
  'Treatment',
  'Checkup',
  'Deworming',
  'Surgery',
  'Other',
] as const;

export const HEALTH_RECORD_STATUSES = ['Completed', 'Scheduled', 'Overdue', 'Cancelled'] as const;


