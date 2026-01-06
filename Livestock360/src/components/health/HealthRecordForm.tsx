import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { spacing } from '../../config/theme';

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

  const handleSubmit = () => {
    onSubmit?.({ title, type, notes });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Title"
        placeholder="Vaccination / Treatment"
        value={title}
        onChangeText={setTitle}
      />

      <Input
        label="Type"
        placeholder="vaccination / treatment"
        value={type}
        onChangeText={setType}
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
