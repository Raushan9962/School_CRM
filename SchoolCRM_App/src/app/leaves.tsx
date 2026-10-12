import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../services/api';
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Send 
} from 'lucide-react-native';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Other'];

export default function LeavesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'list' | 'apply'>('list');
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let res = await apiFetch('/staff/leaves');
      if (!res.ok || res.status === 404) {
        res = await apiFetch('/teacher-portal/leaves');
      }

      if (res.ok && res.data.success) {
        setLeaves(res.data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async () => {
    if (!startDate.trim() || !endDate.trim() || !reason.trim()) {
      Alert.alert('Required Fields', 'Please fill in all dates and reason.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        leave_type: leaveType,
        start_date: startDate.trim(),
        end_date: endDate.trim(),
        reason: reason.trim(),
      };

      let res = await apiFetch('/staff/leaves', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok || res.status === 404) {
        res = await apiFetch('/teacher-portal/leaves', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.ok && res.data.success) {
        Alert.alert('Success', 'Leave request submitted successfully!');
        setStartDate('');
        setEndDate('');
        setReason('');
        await fetchLeaves();
        setActiveTab('list');
      } else {
        Alert.alert('Submission Failed', res.data?.message || 'Could not submit leave request.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error while submitting leave.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Leave Management</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Sub Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'list' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
            Leave History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'apply' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('apply')}
        >
          <Text style={[styles.tabText, activeTab === 'apply' && styles.tabTextActive]}>
            Apply Leave
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'list' ? (
        <View style={styles.content}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#ea580c" />
              <Text style={styles.loadingText}>Loading leave requests...</Text>
            </View>
          ) : leaves.length === 0 ? (
            <View style={styles.center}>
              <CalendarDays size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Leave Applications</Text>
              <Text style={styles.emptyDesc}>You haven't applied for any leaves yet.</Text>
              <TouchableOpacity 
                style={styles.applyNowBtn}
                onPress={() => setActiveTab('apply')}
              >
                <PlusCircle size={16} color="#ffffff" />
                <Text style={styles.applyNowText}>Apply For Leave</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={leaves}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              contentContainerStyle={{ padding: 16 }}
              refreshing={loading}
              onRefresh={fetchLeaves}
              renderItem={({ item }) => {
                const isApproved = item.status === 'Approved';
                const isRejected = item.status === 'Rejected';
                const isPending = !isApproved && !isRejected;

                const startDateStr = item.start_date || item.from_date;
                const endDateStr = item.end_date || item.to_date;

                return (
                  <View style={styles.leaveCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.leaveTypeTitle}>{item.leave_type || item.type}</Text>
                      <View style={[
                        styles.statusPill,
                        isApproved && styles.pillApproved,
                        isRejected && styles.pillRejected,
                        isPending && styles.pillPending,
                      ]}>
                        {isApproved && <CheckCircle2 size={12} color="#166534" />}
                        {isRejected && <XCircle size={12} color="#991b1b" />}
                        {isPending && <Clock size={12} color="#92400e" />}
                        <Text style={[
                          styles.statusText,
                          isApproved && styles.textApproved,
                          isRejected && styles.textRejected,
                          isPending && styles.textPending,
                        ]}>
                          {item.status || 'Pending'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.reasonText}>{item.reason}</Text>

                    <View style={styles.dateRow}>
                      <Text style={styles.dateLabel}>Dates: </Text>
                      <Text style={styles.dateValue}>
                        {startDateStr ? new Date(startDateStr).toLocaleDateString('en-IN') : '—'} 
                        {'  to  '}
                        {endDateStr ? new Date(endDateStr).toLocaleDateString('en-IN') : '—'}
                      </Text>
                    </View>

                    <View style={styles.footerRow}>
                      <Text style={styles.daysBadge}>
                        {item.days ? `${item.days} Day(s)` : 'Leave Period'}
                      </Text>
                      <Text style={styles.appliedOn}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : ''}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Leave Application</Text>
            <Text style={styles.formSubtitle}>Submit your leave details to the administration</Text>

            {/* Leave Type Selection */}
            <Text style={styles.inputLabel}>Leave Type *</Text>
            <View style={styles.typeRow}>
              {LEAVE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, leaveType === type && styles.typeChipActive]}
                  onPress={() => setLeaveType(type)}
                >
                  <Text style={[styles.typeChipText, leaveType === type && styles.typeChipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Start Date */}
            <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 2026-10-15"
              placeholderTextColor="#94a3b8"
              value={startDate}
              onChangeText={setStartDate}
            />

            {/* End Date */}
            <Text style={styles.inputLabel}>End Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 2026-10-17"
              placeholderTextColor="#94a3b8"
              value={endDate}
              onChangeText={setEndDate}
            />

            {/* Reason */}
            <Text style={styles.inputLabel}>Reason *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Explain the reason for taking leave..."
              placeholderTextColor="#94a3b8"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
              onPress={handleApplyLeave}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.btnRow}>
                  <Send size={18} color="#ffffff" />
                  <Text style={styles.submitBtnText}>SUBMIT LEAVE REQUEST</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBar: {
    backgroundColor: '#0f172a',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 8,
  },
  topTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#ea580c',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ea580c',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  applyNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ea580c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyNowText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  leaveCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  pillApproved: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  pillRejected: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  pillPending: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textApproved: {
    color: '#166534',
  },
  textRejected: {
    color: '#991b1b',
  },
  textPending: {
    color: '#92400e',
  },
  reasonText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  dateValue: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 4,
  },
  daysBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  appliedOn: {
    fontSize: 11,
    color: '#94a3b8',
  },
  formScroll: {
    padding: 16,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  typeChipActive: {
    borderColor: '#ea580c',
    backgroundColor: '#ffedd5',
  },
  typeChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  typeChipTextActive: {
    color: '#c2410c',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 16,
  },
  textArea: {
    height: 90,
    paddingTop: 10,
  },
  submitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
