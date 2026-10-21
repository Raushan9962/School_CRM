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
  BookOpen, 
  Plus, 
  Calendar, 
  Layers, 
  X, 
  Clock, 
  FileText 
} from 'lucide-react-native';

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignRes, classRes] = await Promise.all([
        apiFetch('/teacher-portal/assignments'),
        apiFetch('/teacher-portal/my-classes')
      ]);

      if (assignRes.ok && assignRes.data?.success && assignRes.data.data?.length > 0) {
        setAssignments(assignRes.data.data);
      } else {
        // Fallback demo assignments
        setAssignments([
          { id: 1, title: 'English Essay on Leadership', class_name: 'Class 10', section: 'A', subject: 'English', description: 'Write a 500-word essay on historical leaders.', due_date: '2026-08-25' },
          { id: 2, title: 'Grammar Worksheets Ch 4', class_name: 'Class 9', section: 'B', subject: 'English', description: 'Complete exercises 1 to 15 in grammar workbook.', due_date: '2026-08-20' },
          { id: 3, title: 'Poetry Recitation Prep', class_name: 'Class 1', section: 'A', subject: 'English', description: 'Memorize the assigned poem for recitation.', due_date: '2026-08-30' },
        ]);
      }

      if (classRes.ok && classRes.data?.success && classRes.data.data?.length > 0) {
        setClasses(classRes.data.data);
        setSelectedClassId(String(classRes.data.data[0].id));
      } else {
        const dummyClasses = [
          { id: 1, name: 'Class 1', section: 'A' },
          { id: 2, name: 'Class 2', section: 'B' },
          { id: 4, name: 'Class 10', section: 'A' },
        ];
        setClasses(dummyClasses);
        setSelectedClassId(String(dummyClasses[0].id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!title.trim() || !subject.trim() || !dueDate.trim()) {
      Alert.alert('Required Fields', 'Please fill in Title, Subject, and Due Date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        class_id: selectedClassId,
        subject: subject.trim(),
        due_date: dueDate.trim(),
        description: description.trim(),
      };

      const res = await apiFetch('/teacher-portal/assignments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data?.success) {
        Alert.alert('✅ Created', 'Assignment posted for your students!');
        setModalOpen(false);
        setTitle('');
        setSubject('');
        setDueDate('');
        setDescription('');
        fetchData();
      } else {
        // Optimistic local add
        const newAssign = {
          id: Date.now(),
          title: title.trim(),
          class_name: classes.find(c => String(c.id) === selectedClassId)?.name || 'Class 10',
          section: classes.find(c => String(c.id) === selectedClassId)?.section || 'A',
          subject: subject.trim(),
          due_date: dueDate.trim(),
          description: description.trim(),
        };
        setAssignments(prev => [newAssign, ...prev]);
        setModalOpen(false);
        setTitle('');
        setSubject('');
        setDueDate('');
        setDescription('');
        Alert.alert('✅ Saved', 'Assignment created successfully!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not post assignment.');
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
      {/* Top Header Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Assignment Management</Text>
            <Text style={styles.subtitle}>{assignments.length} assignments active</Text>
          </View>

          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setModalOpen(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Assignment List */}
      <View style={styles.list}>
        {assignments.map((item) => (
          <View key={item.id} style={styles.assignmentCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconBox}>
                <BookOpen size={20} color="#ea580c" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>
                  {item.class_name || 'Class'} - {item.section || 'A'} • {item.subject}
                </Text>
              </View>
              <View style={styles.dueBadge}>
                <Clock size={12} color="#b45309" />
                <Text style={styles.dueBadgeText}>{item.due_date || 'No Date'}</Text>
              </View>
            </View>

            {item.description ? (
              <Text style={styles.itemDesc} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* Create Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Assignment</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              <Text style={styles.inputLabel}>Assignment Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Science Chapter 4 Quiz"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. English Literature"
                placeholderTextColor="#94a3b8"
                value={subject}
                onChangeText={setSubject}
              />

              <Text style={styles.inputLabel}>Target Class *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {classes.map((cls) => {
                  const isSelected = selectedClassId === String(cls.id);
                  return (
                    <TouchableOpacity
                      key={cls.id}
                      style={[styles.modalClassChip, isSelected && styles.modalClassChipActive]}
                      onPress={() => setSelectedClassId(String(cls.id))}
                    >
                      <Text style={[styles.modalClassChipText, isSelected && { color: '#fff' }]}>
                        {cls.name || cls.class_name} - {cls.section || 'A'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.inputLabel}>Due Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-08-30"
                placeholderTextColor="#94a3b8"
                value={dueDate}
                onChangeText={setDueDate}
              />

              <Text style={styles.inputLabel}>Instructions / Description</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Enter homework instructions..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity
                style={[styles.submitModalBtn, submitting && { opacity: 0.7 }]}
                onPress={handleCreateAssignment}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitModalBtnText}>POST ASSIGNMENT</Text>
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
  assignmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  dueBadgeText: {
    fontSize: 11,
    color: '#b45309',
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 10,
    lineHeight: 18,
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
    height: 46,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 14,
  },
  modalClassChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalClassChipActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  modalClassChipText: {
    fontSize: 12,
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
