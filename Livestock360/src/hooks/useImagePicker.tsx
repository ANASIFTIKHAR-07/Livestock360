// src/hooks/useImagePicker.tsx
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

export interface PickedImage {
  uri: string;
}

export const useImagePicker = () => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pick an image from the device.
   * NOTE: Placeholder. Integrate with expo-image-picker or react-native-image-picker.
   */
  const pickImage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        throw new Error('Image picking is not implemented for web.');
      }
      // Placeholder for mobile: Replace with real picker logic
      throw new Error(
        'Image picker not wired. Integrate expo-image-picker or react-native-image-picker.'
      );
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
