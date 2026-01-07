import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

export interface PickedImage {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;  // Make this optional
}

export const useImagePicker = () => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        throw new Error('Image picker is not supported on web.');
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (result.didCancel) {
        setLoading(false);
        return;
      }

      if (result.errorCode) {
        setError(result.errorMessage || 'Failed to pick image');
        setLoading(false);
        return;
      }

      const asset: Asset | undefined = result.assets?.[0];
      if (asset?.uri) {
        // Build the image object conditionally
        const pickedImage: PickedImage = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo-${Date.now()}.jpg`,
        };
        
        // Only add fileSize if it exists
        if (asset.fileSize !== undefined) {
          pickedImage.fileSize = asset.fileSize;
        }
        
        setImage(pickedImage);
      }
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

  return { image, loading, error, pickImage, clearImage, setImage };
};