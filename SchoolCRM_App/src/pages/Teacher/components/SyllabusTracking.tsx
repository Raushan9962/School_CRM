import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  Alert 
} from 'react-native';
import { apiFetch } from '../../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react-native';

export default function SyllabusTracking() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      const res = await apiFetch('/teacher-portal/syllabus');
      if (res.ok && res.data?.success && res.data.data?.length > 0) {
        setTopics(res.data.data);
      } else {
        // Fallback demo syllabus
        setTopics([
          { id: 1, topic: 'Unit 1: The Letter to God', status: 'Completed', notes: 'Notes distributed & explained' },
          { id: 2, topic: 'Unit 2: Nelson Mandela - Long Walk to Freedom', status: 'Completed', notes: 'Quiz conducted' },
          { id: 3, topic: 'Unit 3: Two Stories about Flying', status: 'In Progress', notes: 'Part 1 completed, Part 2 remaining' },
          { id: 4, topic: 'Unit 4: From the Diary of Anne Frank', status: 'Pending', notes: 'Scheduled for next week' },
          { id: 5, topic: 'Unit 5: Grammar - Tenses & Modals', status: 'Completed', notes: 'Board exercises solved' },
          { id: 6, topic: 'Unit 6: Writing - Formal Letter & Application', status: 'In Progress', notes: 'Draft formats submitted' },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = async (item: any) => {
    const nextStatus = item.status === 'Completed' ? 'In Progress' : 'Completed';
    setTopics(prev => prev.map(t => t.id === item.id ? { ...t, status: nextStatus } : t));

    try {
      await apiFetch('/teacher-portal/syllabus', {
        method: 'POST',
        body: JSON.stringify({
          topic_id: item.id,
          status: nextStatus,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = topics.filter(t => t.status === 'Completed').length;
  const progressPct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Syllabus Tracking</Text>
            <Text style={styles.subtitle}>Curriculum progress & chapter completion</Text>
          </View>
          <TrendingUp size={24} color="#ea580c" />
        </View>

        {/* Overall Progress Meter */}
        <View style={styles.progressBox}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressPctText}>{progressPct}% Completed</Text>
            <Text style={styles.progressSubText}>{completedCount} of {topics.length} Units</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>
        </View>
      </View>

      {/* Chapters List */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Curriculum Units (Tap to toggle status)</Text>

        <View style={styles.topicsList}>
          {topics.map((t, idx) => {
            const isDone = t.status === 'Completed';
            return (
              <TouchableOpacity
                key={t.id || idx}
                style={[styles.topicItem, isDone && styles.topicItemDone]}
                onPress={() => toggleTopic(t)}
                activeOpacity={0.7}
              >
                {isDone ? (
                  <CheckCircle2 size={20} color="#16a34a" />
                ) : (
                  <Clock size={20} color="#ea580c" />
                )}

                <View style={{ flex: 1 }}>
                  <Text style={[styles.topicName, isDone && styles.topicNameDone]}>{t.topic}</Text>
                  <Text style={styles.topicNotes}>{t.notes || t.status}</Text>
                </View>

                <View style={[styles.statusBadge, isDone ? styles.badgeDone : styles.badgeProgress]}>
                  <Text style={[styles.statusBadgeText, isDone ? { color: '#16a34a' } : { color: '#ea580c' }]}>
                    {t.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
    marginBottom: 16,
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
  progressBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPctText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16a34a',
  },
  progressSubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  topicsList: {
    gap: 10,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  topicItemDone: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
  },
  topicName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  topicNameDone: {
    color: '#15803d',
  },
  topicNotes: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeDone: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  badgeProgress: {
    backgroundColor: '#ffedd5',
    borderColor: '#fed7aa',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
