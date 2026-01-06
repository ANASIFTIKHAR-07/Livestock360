// src/utils/validators.ts

export const isRequired = (value: string | null | undefined): boolean =>
  !!value && value.trim().length > 0;

export const minLength = (value: string | null | undefined, len: number): boolean =>
  !!value && value.trim().length >= len;

export const isEmail = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export type ValidationErrors<T extends string = string> = Partial<Record<T, string>>;


