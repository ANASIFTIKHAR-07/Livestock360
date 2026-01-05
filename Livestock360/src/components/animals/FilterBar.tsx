// src/components/animals/FilterBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

interface FilterBarProps {
  filters: string[];
  selectedFilter: string;
  onSelect: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, selectedFilter, onSelect }) => {
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            selectedFilter === filter && { backgroundColor: colors.primary },
          ]}
          onPress={() => onSelect(filter)}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter && { color: colors.white },
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterText: {
    ...typography.body,
    color: colors.text,
  },
});
