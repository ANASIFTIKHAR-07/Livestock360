import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { spacing } from '../../config/theme';

const HealthRecordForm = ({ initialValues = {}, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [type, setType] = useState(initialValues.type || '');
  const [notes, setNotes] = useState(initialValues.notes || '');

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
