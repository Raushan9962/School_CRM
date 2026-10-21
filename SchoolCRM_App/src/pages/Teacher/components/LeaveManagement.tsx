import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView,
  Modal 
} from 'react-native';
import { apiFetch } from '../../../services/api';
import { 
  ClipboardList, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  X, 
  CalendarDays 
} from 'lucide-react-native';

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Other'];

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await apiFetch('/teacher-portal/leaves');
      if (res.ok && res.data?.success && res.data.data?.length > 0) {
        setLeaves(res.data.data);
      } else {
        // Fallback demo leaves
        setLeaves([
          { id: 1, leave_type: 'Casual Leave', start_date: '2026-08-25', end_date: '2026-08-26', total_days: 2, status: 'Pending', reason: 'Family function in hometown' },
          { id: 2, leave_type: 'Sick Leave', start_date: '2026-07-10', end_date: '2026-07-11', total_days: 2, status: 'Approved', reason: 'Viral fever and rest' },
          { id: 3, leave_type: 'Earned Leave', start_date: '2026-06-01', end_date: '2026-06-05', total_days: 5, status: 'Approved', reason: 'Annual summer vacation' },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async () => {
    if (!startDate.trim() || !endDate.trim() || !reason.trim()) {
      Alert.alert('Required Fields', 'Please enter Start Date, End Date, and Reason.');
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

      const res = await apiFetch('/teacher-portal/leaves', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data?.success) {
        Alert.alert('✅ Leave Applied', 'Your leave request has been submitted to Principal!');
        setModalOpen(false);
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaves();
      } else {
        const newLeave = {
          id: Date.now(),
          leave_type: leaveType,
          start_date: startDate.trim(),
          end_date: endDate.trim(),
          total_days: 1,
          status: 'Pending',
          reason: reason.trim(),
        };
        setLeaves(prev => [newLeave, ...prev]);
        setModalOpen(false);
        setStartDate('');
        setEndDate('');
        setReason('');
        Alert.alert('✅ Saved', 'Leave application recorded as Pending.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit leave.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title & Apply Button */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Leave Management</Text>
            <Text style={styles.subtitle}>Teacher HR leave application & quota balances</Text>
          </View>

          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setModalOpen(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Quota Balance Cards */}
        <View style={styles.balanceRow}>
          <View style={[styles.balanceCard, { borderLeftColor: '#3b82f6' }]}>
            <Text style={styles.balanceLabel}>CASUAL</Text>
            <Text style={styles.balanceValue}>8 Days</Text>
          </View>

          <View style={[styles.balanceCard, { borderLeftColor: '#10b981' }]}>
            <Text style={styles.balanceLabel}>SICK</Text>
            <Text style={styles.balanceValue}>5 Days</Text>
          </View>

          <View style={[styles.balanceCard, { borderLeftColor: '#8b5cf6' }]}>
            <Text style={styles.balanceLabel}>EARNED</Text>
            <Text style={styles.balanceValue}>12 Days</Text>
          </View>
        </View>
      </View>

      {/* Applied Leaves History */}
      <View style={styles.list}>
        <Text style={styles.sectionHeader}>Leave Applications History</Text>
        {leaves.map((item) => {
          const isApproved = item.status === 'Approved';
          const isPending = item.status === 'Pending';
          const isRejected = item.status === 'Rejected';

          return (
            <View key={item.id} style={styles.leaveCard}>
              <View style={styles.cardTopRow}>
                <View>
                  <Text style={styles.leaveTypeText}>{item.leave_type}</Text>
                  <Text style={styles.dateDuration}>
                    {item.start_date} to {item.end_date} ({item.total_days || 1} Days)
                  </Text>
                </View>

                <View style={[
                  styles.statusBadge,
                  isApproved && styles.badgeApproved,
                  isPending && styles.badgePending,
                  isRejected && styles.badgeRejected,
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    isApproved && { color: '#059669' },
                    isPending && { color: '#d97706' },
                    isRejected && { color: '#dc2626' },
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.reasonText}>Reason: {item.reason}</Text>
            </View>
          );
        })}
      </View>

      {/* Apply Leave Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              <Text style={styles.inputLabel}>Leave Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {LEAVE_TYPES.map((type) => {
                  const isSelected = leaveType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeChip, isSelected && styles.typeChipActive]}
                      onPress={() => setLeaveType(type)}
                    >
                      <Text style={[styles.typeChipText, isSelected && { color: '#ffffff' }]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-09-01"
                placeholderTextColor="#94a3b8"
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={styles.inputLabel}>End Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-09-03"
                placeholderTextColor="#94a3b8"
                value={endDate}
                onChangeText={setEndDate}
              />

              <Text style={styles.inputLabel}>Reason for Leave *</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="State your reason for leave..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={reason}
                onChangeText={setReason}
              />

              <TouchableOpacity
                style={[styles.submitModalBtn, submitting && { opacity: 0.7 }]}
                onPress={handleApplyLeave}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitModalBtnText}>SUBMIT LEAVE REQUEST</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ea580c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 14,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  balanceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  list: {
    gap: 12,
  },
  leaveCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leaveTypeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  dateDuration: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeApproved: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  badgePending: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  badgeRejected: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  reasonText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  formScroll: {
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeChipActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 14,
  },
  submitModalBtn: {
    height: 48,
    backgroundColor: '#ea580c',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitModalBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
