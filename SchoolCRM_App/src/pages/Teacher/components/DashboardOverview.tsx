import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Alert 
} from 'react-native';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Briefcase, 
  CalendarCheck, 
  Clock, 
  Sparkles, 
  QrCode 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DashboardOverviewProps {
  user: any;
  stats: any;
  classes: any[];
  onNavigateTab: (tabId: string) => void;
}

export default function DashboardOverview({
  user,
  stats,
  classes,
  onNavigateTab
}: DashboardOverviewProps) {
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
  const todayFormatted = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.container}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.dateRow}>
          <Calendar size={13} color="#ea580c" />
          <Text style={styles.dateText}>{todayFormatted}</Text>
        </View>
        <Text style={styles.greetingText}>
          {greeting}, {user?.name?.split(' ')[0] || 'Teacher'} 👋
        </Text>
        <Text style={styles.subGreeting}>
          Here is what is happening with your classes and tasks today.
        </Text>

        <TouchableOpacity 
          style={styles.markAttendanceBtn} 
          onPress={() => Alert.alert('Attendance', 'Self QR Attendance marked successfully for today!')}
          activeOpacity={0.8}
        >
          <QrCode size={16} color="#ffffff" />
          <Text style={styles.markAttendanceBtnText}>Mark Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* 4 KPI Cards */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderLeftColor: '#3b82f6' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#eff6ff' }]}>
            <BookOpen size={20} color="#3b82f6" />
          </View>
          <Text style={styles.kpiLabel}>TOTAL CLASSES</Text>
          <Text style={styles.kpiValue}>{classes?.length || stats?.totalClasses || '0'}</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#10b981' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#ecfdf5' }]}>
            <Users size={20} color="#10b981" />
          </View>
          <Text style={styles.kpiLabel}>TOTAL STUDENTS</Text>
          <Text style={styles.kpiValue}>{stats?.totalStudents || '48'}</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#f59e0b' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#fef3c7' }]}>
            <Briefcase size={20} color="#f59e0b" />
          </View>
          <Text style={styles.kpiLabel}>PENDING TASKS</Text>
          <Text style={styles.kpiValue}>{stats?.pendingWork || '0'}</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#8b5cf6' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#f5f3ff' }]}>
            <CalendarCheck size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.kpiLabel}>LEAVE BALANCE</Text>
          <Text style={styles.kpiValue}>
            {stats?.leaveBalance?.casual ? `${stats.leaveBalance.casual} Days` : '8 Days'}
          </Text>
        </View>
      </View>

      {/* Today's Schedule Card */}
      <View style={styles.webCard}>
        <View style={styles.webCardHeader}>
          <View style={styles.headerLeft}>
            <Clock size={18} color="#0f172a" />
            <Text style={styles.webCardTitle}>Today's Class Schedule</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>
              {stats?.todaySchedule?.length || (classes?.length > 0 ? classes.length : '2')} Periods
            </Text>
          </View>
        </View>

        {classes && classes.length > 0 ? (
          classes.map((cls, idx) => (
            <View key={idx} style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>Period {idx + 1}</Text>
                <Text style={styles.scheduleTimeSub}>09:00 AM</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleClassText}>{cls.class_name || cls.name || 'Class 10-A'}</Text>
                <Text style={styles.scheduleSubjectText}>{cls.subject || 'English Literature'}</Text>
              </View>
              <TouchableOpacity 
                style={styles.scheduleActionBtn}
                onPress={() => onNavigateTab('attendance')}
              >
                <Text style={styles.scheduleActionText}>Take Att.</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptySchedule}>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>09:30 AM</Text>
                <Text style={styles.scheduleTimeSub}>Room 102</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleClassText}>Class 10 - Section A</Text>
                <Text style={styles.scheduleSubjectText}>English Core & Grammar</Text>
              </View>
              <TouchableOpacity 
                style={styles.scheduleActionBtn}
                onPress={() => onNavigateTab('attendance')}
              >
                <Text style={styles.scheduleActionText}>Attendance</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>11:45 AM</Text>
                <Text style={styles.scheduleTimeSub}>Room 105</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleClassText}>Class 9 - Section B</Text>
                <Text style={styles.scheduleSubjectText}>Literature & Composition</Text>
              </View>
              <TouchableOpacity 
                style={styles.scheduleActionBtn}
                onPress={() => onNavigateTab('attendance')}
              >
                <Text style={styles.scheduleActionText}>Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Quick Navigation Shortcuts */}
      <View style={styles.webCard}>
        <View style={styles.webCardHeader}>
          <View style={styles.headerLeft}>
            <Sparkles size={18} color="#ea580c" />
            <Text style={styles.webCardTitle}>Teacher Management Services</Text>
          </View>
        </View>

        <View style={styles.shortcutGrid}>
          {[
            { id: 'attendance', label: 'Attendance', icon: Users },
            { id: 'academic', label: 'Academic', icon: BookOpen },
            { id: 'assignments', label: 'Assignments', icon: Briefcase },
            { id: 'exams', label: 'Exams & Marks', icon: Clock },
            { id: 'leaves', label: 'HR Leaves', icon: CalendarCheck, isSpecial: true },
            { id: 'profile', label: 'My Profile', icon: Users },
          ].map((item) => {
            const IconC = item.icon;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.shortcutBtn}
                onPress={() => onNavigateTab(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.shortcutIcon, item.isSpecial && { backgroundColor: '#ea580c' }]}>
                  <IconC size={20} color={item.isSpecial ? '#ffffff' : '#0f172a'} />
                </View>
                <Text style={styles.shortcutLabel} numberOfLines={1}>{item.label}</Text>
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
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
    textTransform: 'uppercase',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subGreeting: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 16,
  },
  markAttendanceBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  markAttendanceBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flexBasis: (width - 44) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  webCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  webCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  badgePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  scheduleTime: {
    width: 75,
  },
  scheduleTimeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  scheduleTimeSub: {
    fontSize: 11,
    color: '#64748b',
  },
  scheduleDetails: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scheduleClassText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scheduleSubjectText: {
    fontSize: 12,
    color: '#64748b',
  },
  scheduleActionBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scheduleActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  emptySchedule: {
    gap: 4,
  },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shortcutBtn: {
    flexBasis: (width - 68) / 3,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
});
