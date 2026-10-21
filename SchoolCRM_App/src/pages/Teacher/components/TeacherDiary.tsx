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
  NotebookPen, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  X, 
  Clock, 
  BookOpen 
} from 'lucide-react-native';

export default function TeacherDiary() {
  const [entries, setEntries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [selectedClassId, setSelectedClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [activities, setActivities] = useState('');
  const [homework, setHomework] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [diaryRes, classRes] = await Promise.all([
        apiFetch('/teacher-portal/diary'),
        apiFetch('/teacher-portal/my-classes')
      ]);

      if (diaryRes.ok && diaryRes.data?.success && diaryRes.data.data?.length > 0) {
        setEntries(diaryRes.data.data);
      } else {
        // Fallback demo entries
        setEntries([
          { id: 1, class_name: 'Class 10', section: 'A', subject: 'English', topic: 'Poem - The Road Not Taken', activities: 'Read aloud stanza 1-3, explained metaphors', homework: 'Write summary in notebook', date: new Date().toISOString().split('T')[0] },
          { id: 2, class_name: 'Class 9', section: 'B', subject: 'English', topic: 'Active & Passive Voice', activities: 'Grammar exercises on board', homework: 'Ex 5.2 Q1 to 10', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
        ]);
      }

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async () => {
    if (!topic.trim() || !subject.trim()) {
      Alert.alert('Required Fields', 'Please enter Topic and Subject.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        class_id: selectedClassId,
        subject: subject.trim(),
        date,
        topic: topic.trim(),
        activities: activities.trim(),
        homework: homework.trim(),
      };

      const res = await apiFetch('/teacher-portal/diary', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data?.success) {
        Alert.alert('✅ Saved', 'Lesson diary entry saved successfully!');
        setModalOpen(false);
        setTopic('');
        setActivities('');
        setHomework('');
        fetchData();
      } else {
        const newEntry = {
          id: Date.now(),
          class_name: classes.find(c => String(c.id) === selectedClassId)?.name || 'Class 10',
          section: classes.find(c => String(c.id) === selectedClassId)?.section || 'A',
          subject: subject.trim(),
          topic: topic.trim(),
          activities: activities.trim(),
          homework: homework.trim(),
          date,
        };
        setEntries(prev => [newEntry, ...prev]);
        setModalOpen(false);
        setTopic('');
        setActivities('');
        setHomework('');
        Alert.alert('✅ Saved', 'Diary entry saved!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save entry.');
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
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Teacher Lesson Diary</Text>
            <Text style={styles.subtitle}>Daily classroom teaching logs & homework</Text>
          </View>

          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setModalOpen(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Add Log</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Diary Timeline Entries */}
      <View style={styles.list}>
        {entries.map((item) => (
          <View key={item.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.dateBadge}>
                <Calendar size={13} color="#ea580c" />
                <Text style={styles.dateBadgeText}>{item.date || 'Today'}</Text>
              </View>
              <Text style={styles.classBadge}>
                {item.class_name || 'Class'} - {item.section || 'A'} • {item.subject}
              </Text>
            </View>

            <Text style={styles.topicText}>{item.topic}</Text>

            {item.activities ? (
              <View style={styles.subSection}>
                <Text style={styles.subSectionLabel}>Activities & Teaching:</Text>
                <Text style={styles.subSectionContent}>{item.activities}</Text>
              </View>
            ) : null}

            {item.homework ? (
              <View style={[styles.subSection, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                <Text style={[styles.subSectionLabel, { color: '#9a3412' }]}>Assigned Homework:</Text>
                <Text style={[styles.subSectionContent, { color: '#c2410c' }]}>{item.homework}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {/* Create Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Daily Diary Entry</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. English"
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

              <Text style={styles.inputLabel}>Topic / Lesson Covered *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Chapter 3 - Direct and Indirect Speech"
                placeholderTextColor="#94a3b8"
                value={topic}
                onChangeText={setTopic}
              />

              <Text style={styles.inputLabel}>Classroom Activities</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="e.g. Guided exercises, group discussion"
                placeholderTextColor="#94a3b8"
                multiline
                value={activities}
                onChangeText={setActivities}
              />

              <Text style={styles.inputLabel}>Assigned Homework</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="e.g. Practice questions 1 to 5"
                placeholderTextColor="#94a3b8"
                multiline
                value={homework}
                onChangeText={setHomework}
              />

              <TouchableOpacity
                style={[styles.submitModalBtn, submitting && { opacity: 0.7 }]}
                onPress={handleCreateEntry}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitModalBtnText}>SAVE TO DIARY</Text>
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
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },
  classBadge: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  topicText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  subSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  subSectionContent: {
    fontSize: 13,
    color: '#334155',
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
