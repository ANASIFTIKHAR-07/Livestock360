// src/utils/imageHelpers.ts

export const getFileNameFromUri = (uri?: string | null): string | null => {
  if (!uri) return null;
  const parts = uri.split(/[\\/]/);
  return parts.pop() || null;
};

export const isImageUri = (uri?: string | null): boolean => {
  if (!uri) return false;
  return /\.(png|jpg|jpeg|gif|webp)$/i.test(uri);
};


