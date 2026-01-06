// src/hooks/useImagePicker.tsx
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

export interface PickedImage {
  uri: string;
}

export const useImagePicker = () => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOTE: This is a placeholder. Wire this to expo-image-picker or react-native-image-picker in your environment.
  const pickImage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: integrate with real image picker library.
      if (Platform.OS === 'web') {
        throw new Error('Image picking not implemented for web.');
      }
      throw new Error('Image picker not wired. Integrate expo-image-picker or react-native-image-picker.');
    } catch (err: any) {
      setError(err?.message || 'Failed to pick image');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    setError(null);
  }, []);

  return {
    image,
    loading,
    error,
    pickImage,
    clearImage,
    setImage,
  };
};


