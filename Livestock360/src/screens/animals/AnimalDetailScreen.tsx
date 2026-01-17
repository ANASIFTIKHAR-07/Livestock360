// src/screens/animals/AnimalDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { spacing, colors } from '../../config/theme';
import { getAnimalById, deleteAnimal, Animal } from '../../api/animal.api';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';
import Header from '../../components/layout/Header';

type AnimalDetailRouteProp = RouteProp<AnimalsStackParamList, 'AnimalDetail'>;
type AnimalDetailNavigationProp = NavigationProp<AnimalsStackParamList>;

interface Props {
  refetchList?: () => void;
}

const AnimalDetailScreen: React.FC<Props> = ({ refetchList }) => {
  const route = useRoute<AnimalDetailRouteProp>();
  const navigation = useNavigation<AnimalDetailNavigationProp>();
  const { animalId } = route.params;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnimal = async () => {
    setLoading(true);
    try {
      const res = await getAnimalById(animalId);
      setAnimal(res.data);
    } catch (err) {
      console.error('Failed to fetch animal:', err);
      Alert.alert('Error', 'Failed to load animal details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimal();
  }, [animalId]);

  const handleEdit = () => {
    navigation.navigate('EditAnimal', { animalId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Animal',
      `Are you sure you want to delete ${animal?.name || 'this animal'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnimal(animalId);
              Alert.alert('Deleted', 'Animal has been deleted successfully.');
              if (refetchList) refetchList();
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete animal:', err);
              Alert.alert('Error', 'Failed to delete animal.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Healthy': return colors.success;
      case 'Attention': return colors.warning;
      case 'Critical': return colors.error;
      default: return colors.textLight;
    }
  };

  const getStatusEmoji = (status?: string) => {
    switch (status) {
      case 'Healthy': return '✅';
      case 'Attention': return '⚠️';
      case 'Critical': return '🚨';
      default: return '❓';
    }
  };

  const getAnimalEmoji = (type?: string) => {
    const emojis: Record<string, string> = {
      'Cow': '🐄',
      'Buffalo': '🐃',
      'Goat': '🐐',
      'Sheep': '🐑',
      'Camel': '🐫',
      'Other': '🦙',
    };
    return emojis[type || ''] || '🐄';
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const ageInMs = now.getTime() - birth.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${ageInDays} day${ageInDays > 1 ? 's' : ''}`;
    }
  };

  if (loading || !animal) {
    return (
      <View style={styles.container}>
        <Header 
          title="Animal Details"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Animal Details"
        onBack={() => navigation.goBack()}
        rightContent={
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo & Name Header */}
        <View style={styles.heroSection}>
          {animal.photo ? (
            <Image source={{ uri: animal.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderEmoji}>{getAnimalEmoji(animal.type)}</Text>
            </View>
          )}
          
          <View style={styles.nameSection}>
            <Text style={styles.animalName}>{animal.name || 'Unnamed Animal'}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(animal.status) + '20', borderColor: getStatusColor(animal.status) }]}>
              <Text style={styles.statusEmoji}>{getStatusEmoji(animal.status)}</Text>
              <Text style={[styles.statusText, { color: getStatusColor(animal.status) }]}>
                {animal.status || 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoSection}>
          <View style={styles.quickInfoCard}>
            <Text style={styles.quickInfoEmoji}>🏷️</Text>
            <Text style={styles.quickInfoLabel}>Tag</Text>
            <Text style={styles.quickInfoValue}>{animal.tagNumber}</Text>
          </View>
          
          <View style={styles.quickInfoCard}>
            <Text style={styles.quickInfoEmoji}>{getAnimalEmoji(animal.type)}</Text>
            <Text style={styles.quickInfoLabel}>Type</Text>
            <Text style={styles.quickInfoValue}>{animal.type}</Text>
          </View>
          
          <View style={styles.quickInfoCard}>
            <Text style={styles.quickInfoEmoji}>{animal.gender === 'Male' ? '♂️' : '♀️'}</Text>
            <Text style={styles.quickInfoLabel}>Gender</Text>
            <Text style={styles.quickInfoValue}>{animal.gender}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Details</Text>
          
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailEmoji}>🎂</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Age</Text>
                <Text style={styles.detailValue}>{calculateAge(animal.birthDate)}</Text>
                <Text style={styles.detailSubtext}>
                  Born {new Date(animal.birthDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {animal.breed && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailEmoji}>🧬</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Breed</Text>
                    <Text style={styles.detailValue}>{animal.breed}</Text>
                  </View>
                </View>
              </>
            )}

            {animal.weight && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailEmoji}>⚖️</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>{animal.weight} kg</Text>
                  </View>
                </View>
              </>
            )}

            {animal.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.detailEmoji}>📝</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Notes</Text>
                    <Text style={styles.detailValue}>{animal.notes}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.editButtonLarge}
            onPress={handleEdit}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonLargeText}>✏️ Edit Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete Animal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default AnimalDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textLight,
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // Header Edit Button
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },

  // Hero Section
  heroSection: {
    backgroundColor: colors.white,
    paddingBottom: spacing.lg,
  },
  photo: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surface,
  },
  photoPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderEmoji: {
    fontSize: 120,
  },
  nameSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  animalName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  statusEmoji: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Quick Info Cards
  quickInfoSection: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickInfoEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  quickInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailEmoji: {
    fontSize: 20,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailSubtext: {
    fontSize: 13,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  // Actions
  actionsSection: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  editButtonLarge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  editButtonLargeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  deleteButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },

  bottomPadding: {
    height: spacing.xl,
  },
});