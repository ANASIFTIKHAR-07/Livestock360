// src/utils/dateHelpers.ts

export const formatDate = (value?: string | Date | null): string => {
  if (!value) return 'N/A';
  const date = value instanceof Date ? value : new Date(value);
  const isValid = !isNaN(date.getTime());
  return isValid ? date.toDateString() : 'N/A';
};


