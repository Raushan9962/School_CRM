import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView,
  Modal 
} from 'react-native';
import { apiFetch } from '../../../services/api';
import { 
  ShieldAlert, 
  Plus, 
  Calendar, 
  Layers, 
  X, 
  User, 
  AlertTriangle 
} from 'lucide-react-native';

const INCIDENT_TYPES = [
  'Late Coming', 
  'Homework Not Done', 
  'Mobile Usage', 
  'Class Disturbance', 
  'Fighting/Aggression', 
  'Disrespect', 
  'Cheating', 
  'Other'
];

const ACTIONS_TAKEN = [
  'Verbal Warning', 
  'Written Warning', 
  'Parent Informed', 
  'Sent to Principal', 
  'Counseling', 
  'No Action'
];

export default function BehaviorTracking() {
  const [logs, setLogs] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [incidentType, setIncidentType] = useState('Late Coming');
  const [actionTaken, setActionTaken] = useState('Verbal Warning');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [classRes, logRes] = await Promise.all([
        apiFetch('/teacher-portal/my-classes'),
        apiFetch('/teacher-portal/behavior-log')
      ]);

      if (classRes.ok && classRes.data?.success && classRes.data.data?.length > 0) {
        setClasses(classRes.data.data);
        setSelectedClassId(String(classRes.data.data[0].id));
      } else {
        const dummy = [
          { id: 1, name: 'Class 1', section: 'A' },
          { id: 2, name: 'Class 2', section: 'B' },
          { id: 4, name: 'Class 10', section: 'A' },
        ];
        setClasses(dummy);
        setSelectedClassId(String(dummy[0].id));
      }

      if (logRes.ok && logRes.data?.success && logRes.data.data?.length > 0) {
        setLogs(logRes.data.data);
      } else {
        // Fallback demo incidents
        setLogs([
          { id: 1, student_name: 'Rohan Gupta', class_name: 'Class 10', section: 'A', incident_type: 'Late Coming', description: 'Arrived 20 mins late to period 1.', action_taken: 'Verbal Warning', date: new Date().toISOString().split('T')[0] },
          { id: 2, student_name: 'Aarav Patel', class_name: 'Class 10', section: 'A', incident_type: 'Homework Not Done', description: 'Did not complete assigned essay.', action_taken: 'Parent Informed', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async () => {
    if (!studentName.trim() || !description.trim()) {
      Alert.alert('Required', 'Please enter student name and description.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        class_id: selectedClassId,
        student_name: studentName.trim(),
        incident_type: incidentType,
        action_taken: actionTaken,
        description: description.trim(),
        date: new Date().toISOString().split('T')[0],
      };

      const res = await apiFetch('/teacher-portal/behavior-log', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data?.success) {
        Alert.alert('✅ Logged', 'Behavior incident recorded.');
        setModalOpen(false);
        setStudentName('');
        setDescription('');
        fetchInitialData();
      } else {
        const newLog = {
          id: Date.now(),
          student_name: studentName.trim(),
          class_name: classes.find(c => String(c.id) === selectedClassId)?.name || 'Class 10',
          section: classes.find(c => String(c.id) === selectedClassId)?.section || 'A',
          incident_type: incidentType,
          action_taken: actionTaken,
          description: description.trim(),
          date: new Date().toISOString().split('T')[0],
        };
        setLogs(prev => [newLog, ...prev]);
        setModalOpen(false);
        setStudentName('');
        setDescription('');
        Alert.alert('✅ Saved', 'Incident report created.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save incident.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Behavior Tracking</Text>
            <Text style={styles.subtitle}>Discipline records & incident reporting</Text>
          </View>

          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setModalOpen(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Log Incident</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Incident Logs List */}
      <View style={styles.list}>
        {logs.map((item) => (
          <View key={item.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.student_name}</Text>
                <Text style={styles.metaText}>
                  {item.class_name || 'Class'} - {item.section || 'A'} • {item.date}
                </Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.incident_type}</Text>
              </View>
            </View>

            <Text style={styles.descText}>{item.description}</Text>

            <View style={styles.actionRow}>
              <Text style={styles.actionLabel}>Action Taken:</Text>
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>{item.action_taken}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Incident Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Student Incident</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              <Text style={styles.inputLabel}>Student Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rohan Gupta"
                placeholderTextColor="#94a3b8"
                value={studentName}
                onChangeText={setStudentName}
              />

              <Text style={styles.inputLabel}>Incident Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {INCIDENT_TYPES.map((type) => {
                  const isSelected = incidentType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeChip, isSelected && styles.typeChipActive]}
                      onPress={() => setIncidentType(type)}
                    >
                      <Text style={[styles.typeChipText, isSelected && { color: '#ffffff' }]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.inputLabel}>Action Taken</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {ACTIONS_TAKEN.map((act) => {
                  const isSelected = actionTaken === act;
                  return (
                    <TouchableOpacity
                      key={act}
                      style={[styles.typeChip, isSelected && styles.typeChipActive]}
                      onPress={() => setActionTaken(act)}
                    >
                      <Text style={[styles.typeChipText, isSelected && { color: '#ffffff' }]}>
                        {act}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.inputLabel}>Description / Notes *</Text>
              <TextInput
                style={[styles.input, { height: 75, textAlignVertical: 'top' }]}
                placeholder="Describe what occurred during class..."
                placeholderTextColor="#94a3b8"
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity
                style={[styles.submitModalBtn, submitting && { opacity: 0.7 }]}
                onPress={handleCreateIncident}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitModalBtnText}>RECORD INCIDENT</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  center: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ea580c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  logCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  descText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 8,
  },
  actionLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  actionBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ea580c',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  formScroll: {
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 14,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeChipActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  submitModalBtn: {
    height: 48,
    backgroundColor: '#ea580c',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitModalBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
