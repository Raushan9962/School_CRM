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
  NotebookPen,
  BarChart2,
  ShieldAlert,
  MessageSquare,
  ClipboardList, 
  User 
} from 'lucide-react-native';
import DashboardLayout, { NavItem } from '../../components/layout/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import AttendanceManagement from './components/AttendanceManagement';
import ExamManagement from './components/ExamManagement';
import AssignmentManagement from './components/AssignmentManagement';
import TeacherDiary from './components/TeacherDiary';
import StudentPerformance from './components/StudentPerformance';
import BehaviorTracking from './components/BehaviorTracking';
import ParentInteraction from './components/ParentInteraction';
import AcademicTimetable from './components/AcademicTimetable';
import LeaveManagement from './components/LeaveManagement';
import SyllabusTracking from './components/SyllabusTracking';
import TeacherProfile from './components/TeacherProfile';
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

  // NavItems matching 100% with the web teacher portal
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'exams', label: 'Exams & Marks', icon: FileText },
    { id: 'syllabus', label: 'Syllabus Tracking', icon: TrendingUp },
    { id: 'diary', label: 'Lesson Diary', icon: NotebookPen },
    { id: 'performance', label: 'Student Analytics', icon: BarChart2 },
    { id: 'behavior', label: 'Behavior Tracking', icon: ShieldAlert },
    { id: 'parents', label: 'Parent & PTM', icon: MessageSquare },
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
            onNavigateTab={(tab) => setActiveTab(tab)} 
          />
        );
      case 'academic':
        return <AcademicTimetable />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'assignments':
        return <AssignmentManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'syllabus':
        return <SyllabusTracking />;
      case 'diary':
        return <TeacherDiary />;
      case 'performance':
        return <StudentPerformance />;
      case 'behavior':
        return <BehaviorTracking />;
      case 'parents':
        return <ParentInteraction />;
      case 'leaves':
        return <LeaveManagement />;
      case 'profile':
        return <TeacherProfile user={user} profile={profile} />;
      default:
        return (
          <DashboardOverview 
            user={user} 
            stats={stats} 
            classes={classes} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
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
      onSpecialNav={(tabId) => setActiveTab(tabId)}
      drawerOpen={drawerOpen}
      setDrawerOpen={setDrawerOpen}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#ea580c']} 
            tintColor="#ea580c" 
          />
        }
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
    backgroundColor: '#fff7ed',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
