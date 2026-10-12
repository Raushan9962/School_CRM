import React, { useState, useEffect } from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import TeacherDashboard from '../pages/Teacher/TeacherDashboard';

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

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  const rawRole = (user.role || user.roleName || '').toLowerCase().replace(/\s+/g, '');

  // Render role-specific dashboard page component (Teacher, Student, Principal, etc.)
  return <TeacherDashboard />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
