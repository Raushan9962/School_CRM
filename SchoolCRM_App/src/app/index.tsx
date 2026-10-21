import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { 
  apiFetch, 
  getBaseUrl, 
  setCustomBaseUrl, 
  testServerConnection, 
  DEFAULT_BASE_URL 
} from '../services/api';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sliders
} from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Server Diagnostics State
  const [activeUrl, setActiveUrl] = useState(DEFAULT_BASE_URL);
  const [testingPing, setTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ ok?: boolean; message?: string } | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const url = await getBaseUrl();
        setActiveUrl(url);
        setCustomUrlInput(url);

        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        if (token && user) {
          router.replace('/dashboard');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingAuth(false);
      }
    };
    init();
  }, []);

  const handleTestConnection = async () => {
    setTestingPing(true);
    setPingStatus(null);
    try {
      const res = await testServerConnection();
      if (res.ok) {
        setPingStatus({ ok: true, message: 'Server Connected! (200 OK)' });
        Alert.alert('✅ Connection Success', `Successfully reached backend at:\n${res.url}\n\nServer Response: "${res.message}"`);
      } else {
        setPingStatus({ ok: false, message: 'Cannot reach server' });
        Alert.alert(
          '❌ Connection Failed', 
          `Unable to connect to:\n${res.url}\n\nError: ${res.error}\n\nTroubleshooting:\n1. Ensure Backend is running (npm run dev)\n2. If using real phone, ensure Phone & PC are on the same Wi-Fi\n3. Allow port 8000 on Windows Firewall`
        );
      }
    } catch (err: any) {
      setPingStatus({ ok: false, message: err.message });
      Alert.alert('❌ Error', err.message);
    } finally {
      setTestingPing(false);
    }
  };

  const handleSaveCustomUrl = async () => {
    try {
      const updated = await setCustomBaseUrl(customUrlInput);
      setActiveUrl(updated);
      setShowConfig(false);
      Alert.alert('Saved', `API URL updated to:\n${updated}`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleResetUrl = async () => {
    try {
      const updated = await setCustomBaseUrl('');
      setActiveUrl(updated);
      setCustomUrlInput(updated);
      setShowConfig(false);
      Alert.alert('Reset', `API URL reset to default:\n${updated}`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok && res.data?.success) {
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        router.replace('/dashboard');
      } else {
        const errorMsg = res.data?.message || res.error || 'Invalid credentials';
        Alert.alert('Login Failed', errorMsg);
      }
    } catch (err: any) {
      Alert.alert('Connection Error', `Backend server se connect nahi ho paya.\n\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <GraduationCap size={44} color="#ea580c" />
          </View>
          <Text style={styles.brandTitle}>VidyaSetu</Text>
          <Text style={styles.subTitle}>School ERP & CRM Mobile App</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardDesc}>Enter your email or admission ID to continue</Text>

          {/* Email / ID Input */}
          <View style={styles.inputContainer}>
            <Mail size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Admission Number"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Lock size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.buttonText}>LOGIN</Text>
                <ArrowRight size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Server Diagnostics Section */}
          <View style={styles.serverSection}>
            <View style={styles.serverHeaderRow}>
              <View style={styles.serverStatusPill}>
                <Wifi size={14} color={pingStatus?.ok ? '#16a34a' : (pingStatus ? '#dc2626' : '#ea580c')} />
                <Text 
                  style={[
                    styles.serverUrlText, 
                    pingStatus?.ok && { color: '#16a34a' },
                    pingStatus?.ok === false && { color: '#dc2626' }
                  ]}
                  numberOfLines={1}
                >
                  {pingStatus ? pingStatus.message : activeUrl}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.iconBtn} 
                onPress={handleTestConnection} 
                disabled={testingPing}
                activeOpacity={0.7}
              >
                {testingPing ? (
                  <ActivityIndicator size="small" color="#ea580c" />
                ) : (
                  <RefreshCw size={14} color="#ea580c" />
                )}
                <Text style={styles.iconBtnText}>Test</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.iconBtn} 
                onPress={() => setShowConfig(!showConfig)}
                activeOpacity={0.7}
              >
                <Sliders size={14} color="#64748b" />
                <Text style={[styles.iconBtnText, { color: '#64748b' }]}>Edit IP</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Server Configuration Box */}
            {showConfig && (
              <View style={styles.configBox}>
                <Text style={styles.configLabel}>Custom Backend URL:</Text>
                <TextInput
                  style={styles.configInput}
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  placeholder="http://192.168.1.33:8000/api"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.configActions}>
                  <TouchableOpacity 
                    style={[styles.configActionBtn, { backgroundColor: '#ea580c' }]} 
                    onPress={handleSaveCustomUrl}
                  >
                    <Text style={styles.configActionBtnText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.configActionBtn, { backgroundColor: '#e2e8f0' }]} 
                    onPress={handleResetUrl}
                  >
                    <Text style={[styles.configActionBtnText, { color: '#475569' }]}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#9a3412',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: '#c2410c',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#ea580c',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  serverSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  serverHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  serverStatusPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  serverUrlText: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
    fontWeight: '500',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  iconBtnText: {
    fontSize: 11,
    color: '#ea580c',
    fontWeight: '700',
  },
  configBox: {
    marginTop: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  configInput: {
    height: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 10,
  },
  configActions: {
    flexDirection: 'row',
    gap: 8,
  },
  configActionBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
