import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock } from 'lucide-react-native';

export default function SyllabusTracking() {
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Syllabus Tracking</Text>
        <Text style={styles.subtitle}>Track chapter completion and syllabus status</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeading}>Class 10 - English Core</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressText}>75% Completed (12 of 16 Chapters)</Text>
        </View>

        <View style={styles.chapterItem}>
          <CheckCircle2 size={18} color="#16a34a" />
          <View style={{ flex: 1 }}>
            <Text style={styles.chapterTitle}>Unit 1: The Letter to God</Text>
            <Text style={styles.chapterStatus}>Completed - Notes Distributed</Text>
          </View>
        </View>

        <View style={styles.chapterItem}>
          <CheckCircle2 size={18} color="#16a34a" />
          <View style={{ flex: 1 }}>
            <Text style={styles.chapterTitle}>Unit 2: Nelson Mandela - Long Walk to Freedom</Text>
            <Text style={styles.chapterStatus}>Completed - Quiz conducted</Text>
          </View>
        </View>

        <View style={styles.chapterItem}>
          <Clock size={18} color="#ea580c" />
          <View style={{ flex: 1 }}>
            <Text style={styles.chapterTitle}>Unit 3: Two Stories about Flying</Text>
            <Text style={styles.chapterStatus}>In Progress (Estimated 3 Days)</Text>
          </View>
        </View>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  chapterTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  chapterStatus: {
    fontSize: 11,
    color: '#64748b',
  },
});
