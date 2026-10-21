import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { apiFetch } from '../../../services/api';
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Layers 
} from 'lucide-react-native';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AcademicTimetable() {
  const [activeDay, setActiveDay] = useState('Monday');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await apiFetch('/teacher-portal/my-timetable');
      if (res.ok && res.data?.success && res.data.data?.length > 0) {
        setTimetable(res.data.data);
      } else {
        // Fallback demo timetable
        setTimetable([
          { day: 'Monday', period_number: 1, time: '09:00 AM - 09:45 AM', class_name: 'Class 10', section: 'A', subject: 'English Grammar', room: 'Room 102' },
          { day: 'Monday', period_number: 2, time: '09:50 AM - 10:35 AM', class_name: 'Class 9', section: 'B', subject: 'English Composition', room: 'Room 105' },
          { day: 'Monday', period_number: 4, time: '11:45 AM - 12:30 PM', class_name: 'Class 1', section: 'A', subject: 'English Alphabet & Phonics', room: 'Room 201' },
          { day: 'Tuesday', period_number: 1, time: '09:00 AM - 09:45 AM', class_name: 'Class 10', section: 'A', subject: 'English Literature', room: 'Room 102' },
          { day: 'Tuesday', period_number: 3, time: '10:50 AM - 11:35 AM', class_name: 'Class 9', section: 'B', subject: 'Poetry', room: 'Room 105' },
          { day: 'Wednesday', period_number: 2, time: '09:50 AM - 10:35 AM', class_name: 'Class 10', section: 'A', subject: 'Essay Writing', room: 'Room 102' },
          { day: 'Thursday', period_number: 1, time: '09:00 AM - 09:45 AM', class_name: 'Class 1', section: 'A', subject: 'Rhymes & Reading', room: 'Room 201' },
          { day: 'Friday', period_number: 3, time: '10:50 AM - 11:35 AM', class_name: 'Class 10', section: 'A', subject: 'Weekly Quiz & Test', room: 'Room 102' },
          { day: 'Saturday', period_number: 1, time: '09:00 AM - 09:45 AM', class_name: 'Class 9', section: 'B', subject: 'Remedial English', room: 'Room 105' },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const daySchedule = timetable.filter(
    t => t.day?.toLowerCase() === activeDay.toLowerCase()
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Academic Schedule</Text>
            <Text style={styles.subtitle}>Teacher weekly periods & room assignments</Text>
          </View>
          <GraduationCap size={24} color="#ea580c" />
        </View>

        {/* Days Horizontal Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {DAYS.map((d) => {
            const isSelected = activeDay === d;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dayTab, isSelected && styles.dayTabActive]}
                onPress={() => setActiveDay(d)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                  {d.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Periods List */}
      <View style={styles.list}>
        {daySchedule.length > 0 ? (
          daySchedule.map((item, idx) => (
            <View key={idx} style={styles.scheduleCard}>
              <View style={styles.timeBadge}>
                <Clock size={14} color="#ea580c" />
                <Text style={styles.timeText}>{item.time || `Period ${item.period_number || idx + 1}`}</Text>
              </View>

              <View style={styles.periodContent}>
                <View style={styles.classRow}>
                  <Text style={styles.className}>
                    {item.class_name || 'Class'} - {item.section || 'A'}
                  </Text>
                  <View style={styles.roomBadge}>
                    <Text style={styles.roomText}>{item.room || 'Room 101'}</Text>
                  </View>
                </View>

                <Text style={styles.subjectText}>{item.subject || 'General Subject'}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Calendar size={36} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Classes Scheduled</Text>
            <Text style={styles.emptyDesc}>You have no teaching periods scheduled on {activeDay}.</Text>
          </View>
        )}
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
  daysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayTabActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  dayTabTextActive: {
    color: '#ffffff',
  },
  list: {
    gap: 12,
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff7ed',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },
  periodContent: {
    gap: 4,
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  roomBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roomText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  subjectText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});
