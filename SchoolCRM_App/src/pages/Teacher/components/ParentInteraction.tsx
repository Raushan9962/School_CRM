import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { apiFetch } from '../../../services/api';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Phone, 
  Mail, 
  User, 
  ChevronRight, 
  Search 
} from 'lucide-react-native';

export default function ParentInteraction() {
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const res = await apiFetch('/teacher-portal/parents');
      if (res.ok && res.data?.success && res.data.data?.length > 0) {
        setParents(res.data.data);
      } else {
        // Fallback demo parents
        setParents([
          { parent_id: 1, parent_name: 'Mr. Rajesh Gupta', student_name: 'Rohan Gupta', class_name: 'Class 10', section: 'A', phone: '9876543210', email: 'gupta@example.com' },
          { parent_id: 2, parent_name: 'Mrs. Sunita Sharma', student_name: 'Diya Sharma', class_name: 'Class 10', section: 'A', phone: '9876543211', email: 'sharma@example.com' },
          { parent_id: 3, parent_name: 'Mr. Vikram Patel', student_name: 'Aarav Patel', class_name: 'Class 9', section: 'B', phone: '9876543212', email: 'patel@example.com' },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = async (parent: any) => {
    setSelectedParent(parent);
    setChatLoading(true);
    try {
      const res = await apiFetch(`/teacher-portal/messages/${parent.parent_id}`);
      if (res.ok && res.data?.success && res.data.data?.length > 0) {
        setMessages(res.data.data);
      } else {
        // Fallback demo conversation
        setMessages([
          { id: 1, sender_type: 'teacher', message: `Hello Mr./Mrs. ${parent.parent_name?.split(' ')[1] || 'Parent'}, regarding ${parent.student_name}'s progress.`, sent_at: 'Yesterday' },
          { id: 2, sender_type: 'parent', message: 'Thank you for the update teacher, we will ensure homework is finished on time.', sent_at: 'Yesterday' },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedParent) return;
    const text = messageInput.trim();
    setMessageInput('');
    setSending(true);

    // Optimistic UI
    const optimisticMsg = {
      id: Date.now(),
      sender_type: 'teacher',
      message: text,
      sent_at: 'Just now',
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const payload = {
        parent_id: selectedParent.parent_id,
        message: text,
      };

      const res = await apiFetch('/teacher-portal/messages', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn('Backend message save fallback');
      }
    } catch (e) {
      console.error('Send message error:', e);
    } finally {
      setSending(false);
    }
  };

  const filteredParents = parents.filter(p => {
    const q = search.toLowerCase();
    return (
      p.parent_name?.toLowerCase().includes(q) ||
      p.student_name?.toLowerCase().includes(q) ||
      p.class_name?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  // Active Chat Screen
  if (selectedParent) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedParent(null)}>
          <ArrowLeft size={16} color="#ea580c" />
          <Text style={styles.backBtnText}>Back to Parents</Text>
        </TouchableOpacity>

        {/* Parent Header Banner */}
        <View style={styles.card}>
          <View style={styles.chatHeaderRow}>
            <View style={styles.avatarBox}>
              <User size={20} color="#ea580c" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatParentName}>{selectedParent.parent_name}</Text>
              <Text style={styles.chatSubText}>
                Student: {selectedParent.student_name} ({selectedParent.class_name || 'Class 10'}-{selectedParent.section || 'A'})
              </Text>
              {selectedParent.phone ? (
                <Text style={styles.phoneText}>📞 {selectedParent.phone}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Message Thread */}
        <View style={styles.chatCard}>
          <ScrollView contentContainerStyle={styles.messagesScroll}>
            {chatLoading ? (
              <ActivityIndicator size="small" color="#ea580c" style={{ padding: 20 }} />
            ) : (
              messages.map((m, idx) => {
                const isMe = m.sender_type === 'teacher';
                return (
                  <View 
                    key={m.id || idx} 
                    style={[styles.msgWrapper, isMe ? styles.msgWrapperRight : styles.msgWrapperLeft]}
                  >
                    <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                      <Text style={[styles.bubbleText, isMe ? { color: '#ffffff' } : { color: '#0f172a' }]}>
                        {m.message}
                      </Text>
                      <Text style={[styles.timeText, isMe ? { color: '#fed7aa' } : { color: '#94a3b8' }]}>
                        {m.sent_at || ''}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type message to parent..."
              placeholderTextColor="#94a3b8"
              value={messageInput}
              onChangeText={setMessageInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !messageInput.trim() && { opacity: 0.5 }]} 
              onPress={handleSendMessage}
              disabled={!messageInput.trim() || sending}
            >
              <Send size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Parents List Screen
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Parent & PTM Communication</Text>
            <Text style={styles.subtitle}>Direct messaging & student updates for parents</Text>
          </View>
          <MessageSquare size={24} color="#ea580c" />
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by parent or student name..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.list}>
        {filteredParents.map((p) => (
          <TouchableOpacity
            key={p.parent_id}
            style={styles.parentCard}
            onPress={() => handleOpenChat(p)}
            activeOpacity={0.7}
          >
            <View style={styles.parentLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>{p.parent_name?.charAt(0) || 'P'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.parentName}>{p.parent_name}</Text>
                <Text style={styles.studentMeta}>
                  Student: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{p.student_name}</Text> ({p.class_name || 'Class 10'}-{p.section || 'A'})
                </Text>
                {p.phone ? <Text style={styles.metaSub}>📞 {p.phone}</Text> : null}
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </View>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  list: {
    gap: 12,
  },
  parentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  parentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  avatarLetter: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ea580c',
  },
  parentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  studentMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  metaSub: {
    fontSize: 11,
    color: '#ea580c',
    marginTop: 2,
    fontWeight: '600',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#ea580c',
    fontSize: 14,
    fontWeight: '700',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatParentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  chatSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    color: '#ea580c',
    marginTop: 2,
    fontWeight: '700',
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    height: 380,
    elevation: 2,
  },
  messagesScroll: {
    padding: 14,
    gap: 10,
  },
  msgWrapper: {
    flexDirection: 'row',
  },
  msgWrapperRight: {
    justifyContent: 'flex-end',
  },
  msgWrapperLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleRight: {
    backgroundColor: '#ea580c',
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  chatInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0f172a',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
