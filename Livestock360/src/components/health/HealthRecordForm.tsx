import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { spacing } from '../../config/theme';
import { isRequired, minLength, ValidationErrors } from '../../utils/validators';

type HealthRecordFormValues = {
  title: string;
  type: string;
  notes: string;
};

interface HealthRecordFormProps {
  initialValues?: Partial<HealthRecordFormValues>;
  onSubmit?: (values: HealthRecordFormValues) => void;
  loading?: boolean;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  initialValues = {},
  onSubmit,
  loading = false,
}) => {
  const { title: initialTitle = '', type: initialType = '', notes: initialNotes = '' } =
    initialValues;

  const [title, setTitle] = useState<string>(initialTitle);
  const [type, setType] = useState<string>(initialType);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [errors, setErrors] = useState<ValidationErrors<'title' | 'type'>>({});

  const handleSubmit = () => {
    const nextErrors: ValidationErrors<'title' | 'type'> = {};

    if (!isRequired(title)) {
      nextErrors.title = 'Title is required';
    } else if (!minLength(title, 3)) {
      nextErrors.title = 'Title must be at least 3 characters';
    }

    if (!isRequired(type)) {
      nextErrors.type = 'Type is required';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      Alert.alert('Validation', 'Please fix the highlighted fields.');
      return;
    }

    onSubmit?.({ title: title.trim(), type: type.trim(), notes });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Title"
        placeholder="Vaccination / Treatment"
        value={title}
        onChangeText={setTitle}
        error={errors.title ?? null}
      />

      <Input
        label="Type"
        placeholder="vaccination / treatment"
        value={type}
        onChangeText={setType}
        error={errors.type ?? null}
      />

      <Input
        label="Notes"
        placeholder="Additional notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button
        title={loading ? 'Saving...' : 'Save Record'}
        onPress={handleSubmit}
        disabled={loading}
        style={styles.button}
      />
    </View>
  );
};

export default HealthRecordForm;

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
});
