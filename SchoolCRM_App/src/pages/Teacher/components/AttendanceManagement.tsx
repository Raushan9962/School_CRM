import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';

export default function AttendanceManagement() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Patel', roll: '101', status: 'Present' },
    { id: 2, name: 'Diya Sharma', roll: '102', status: 'Present' },
    { id: 3, name: 'Rohan Gupta', roll: '103', status: 'Absent' },
    { id: 4, name: 'Sneha Verma', roll: '104', status: 'Late' },
    { id: 5, name: 'Aditya Singh', roll: '105', status: 'Present' },
  ]);

  const toggleStatus = (id: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.status === 'Present' ? 'Absent' : s.status === 'Absent' ? 'Late' : 'Present';
      return { ...s, status: next };
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Attendance Management</Text>
        <Text style={styles.subtitle}>Mark student attendance for Class 10-A</Text>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.dateLabel}>Date: {new Date().toLocaleDateString('en-IN')}</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity 
            style={[styles.smallBtn, { backgroundColor: '#ecfdf5' }]}
            onPress={() => setStudents(prev => prev.map(s => ({ ...s, status: 'Present' })))}
          >
            <Text style={[styles.smallBtnText, { color: '#059669' }]}>All Present</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.smallBtn, { backgroundColor: '#fef2f2' }]}
            onPress={() => setStudents(prev => prev.map(s => ({ ...s, status: 'Absent' })))}
          >
            <Text style={[styles.smallBtnText, { color: '#dc2626' }]}>All Absent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listCard}>
        {students.map((st) => (
          <View key={st.id} style={styles.studentRow}>
            <View>
              <Text style={styles.nameText}>{st.name}</Text>
              <Text style={styles.rollText}>Roll No: {st.roll}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => toggleStatus(st.id)}
              style={[
                styles.statusBadge,
                st.status === 'Present' && { backgroundColor: '#dcfce7', borderColor: '#86efac' },
                st.status === 'Absent' && { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
                st.status === 'Late' && { backgroundColor: '#fef3c7', borderColor: '#fde68a' },
              ]}
            >
              <Text style={[
                styles.statusText,
                st.status === 'Present' && { color: '#15803d' },
                st.status === 'Absent' && { color: '#b91c1c' },
                st.status === 'Late' && { color: '#b45309' },
              ]}>
                {st.status} (Tap)
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => Alert.alert('Success', 'Attendance saved successfully!')}
        >
          <Text style={styles.submitBtnText}>SAVE ATTENDANCE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ea580c',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  smallBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  rollText: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 14,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
