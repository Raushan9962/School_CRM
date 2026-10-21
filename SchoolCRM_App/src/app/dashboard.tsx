import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import TeacherDashboard from '../pages/Teacher/TeacherDashboard';
import { ShieldAlert, LogOut, ArrowRight, User } from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        } else {
          router.replace('/');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  const roleName = user.role || user.roleName || '';
  const rawRole = roleName.toLowerCase().replace(/\s+/g, '');

  // If user is not a Teacher, display role mismatch explanation with instant Logout
  if (rawRole !== 'teacher') {
    return (
      <View style={styles.roleContainer}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <ShieldAlert size={40} color="#ea580c" />
          </View>

          <Text style={styles.title}>Role Permission Notice</Text>
          
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Logged In User:</Text>
              <Text style={styles.infoValue}>{user.name || user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Your Role:</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{roleName || 'Unknown'}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.explanation}>
            This mobile application is dedicated to the <Text style={{fontWeight: '700', color: '#0f172a'}}>Teacher Portal</Text>. Access to classes, attendance, marks, and timetable is restricted to teachers.
          </Text>

          {user.email?.toLowerCase().includes('royrk3963') && (
            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Tip:</Text>
              <Text style={styles.tipText}>
                Your Teacher account email is <Text style={{fontWeight: 'bold', color: '#ea580c'}}>royrk3964@gmail.com</Text> (Password: 123456).
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <LogOut size={18} color="#ffffff" />
            <Text style={styles.logoutBtnText}>Switch Account / Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Render role-specific dashboard page component for Teacher
  return <TeacherDashboard />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
  },
  roleContainer: {
    flex: 1,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#fed7aa',
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffedd5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  roleBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  roleBadgeText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 12,
  },
  explanation: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
  },
  tipBox: {
    width: '100%',
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fdba74',
    marginBottom: 18,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c2410c',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12,
    color: '#9a3412',
    lineHeight: 17,
  },
  logoutBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#ea580c',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
