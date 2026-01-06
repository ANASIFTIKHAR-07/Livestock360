// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

export const getItem = async (key: string): Promise<string | null> => {
  return AsyncStorage.getItem(key);
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

export const multiRemove = async (keys: string[]): Promise<void> => {
  await AsyncStorage.multiRemove(keys);
};


