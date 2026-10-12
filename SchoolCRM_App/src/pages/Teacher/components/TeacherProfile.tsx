import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TeacherProfileProps {
  user: any;
  profile: any;
}

export default function TeacherProfile({ user, profile }: TeacherProfileProps) {
  const p = profile || {};

  return (
    <View style={styles.container}>
      <View style={styles.profileHeaderBox}>
        <View style={styles.bigAvatar}>
          <Text style={styles.bigAvatarText}>{user?.name?.charAt(0) || 'T'}</Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'Teacher'}</Text>
        <Text style={styles.profileRoleBadge}>
          {p.employee_id || 'ID: ' + user?.id} • Teacher
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeading}>Personal & Professional Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user?.name || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user?.phone || p.phone || '6239401366'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Assigned Class</Text>
          <Text style={styles.value}>{p.class_assigned || 'Class 10'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subject</Text>
          <Text style={styles.value}>{p.subject || 'English'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Qualification</Text>
          <Text style={styles.value}>{p.qualification || 'M.A., B.Ed.'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Employment Type</Text>
          <Text style={styles.value}>{p.employment_type || 'Regular'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  profileHeaderBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bigAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bigAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileRoleBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ea580c',
    marginTop: 4,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    fontSize: 13,
    color: '#64748b',
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
