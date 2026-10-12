import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { 
  LayoutDashboard, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  ClipboardList, 
  User 
} from 'lucide-react-native';
import DashboardLayout, { NavItem } from '../../components/layout/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import AttendanceManagement from './components/AttendanceManagement';
import TeacherProfile from './components/TeacherProfile';
import SyllabusTracking from './components/SyllabusTracking';
import { apiFetch } from '../../services/api';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
        await fetchStatsAndProfile();
      } else {
        router.replace('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsAndProfile = async () => {
    try {
      const [statsRes, profRes, classRes] = await Promise.all([
        apiFetch('/teacher-portal/dashboard-stats'),
        apiFetch('/teacher-portal/profile'),
        apiFetch('/teacher-portal/my-classes'),
      ]);

      if (statsRes.ok && statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (profRes.ok && profRes.data?.success) {
        setProfile(profRes.data.data);
      }
      if (classRes.ok && classRes.data?.success) {
        setClasses(classRes.data.data || []);
      }
    } catch (err) {
      console.error('Teacher fetch error:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatsAndProfile();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          router.replace('/');
        }
      }
    ]);
  };

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'exams', label: 'Exams & Marks', icon: FileText },
    { id: 'syllabus', label: 'Syllabus Tracking', icon: TrendingUp },
    { id: 'leaves', label: 'Human Resource (Leave)', icon: ClipboardList, isSpecial: true },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview 
            user={user} 
            stats={stats} 
            classes={classes} 
            onNavigateTab={(tab) => {
              if (tab === 'leaves') router.push('/leaves');
              else setActiveTab(tab);
            }} 
          />
        );
      case 'attendance':
        return <AttendanceManagement />;
      case 'syllabus':
      case 'academic':
        return <SyllabusTracking />;
      case 'profile':
        return <TeacherProfile user={user} profile={profile} />;
      default:
        return (
          <DashboardOverview 
            user={user} 
            stats={stats} 
            classes={classes} 
            onNavigateTab={(tab) => {
              if (tab === 'leaves') router.push('/leaves');
              else setActiveTab(tab);
            }} 
          />
        );
    }
  };

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      roleName="Teacher"
      userInfo={{
        name: user.name,
        email: user.email,
        role: 'Teacher',
        schoolName: user.schoolName || 'VidyaSetu'
      }}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
      onSpecialNav={(tabId) => {
        if (tabId === 'leaves') router.push('/leaves');
      }}
      drawerOpen={drawerOpen}
      setDrawerOpen={setDrawerOpen}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea580c']} />}
      >
        {renderContent()}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
