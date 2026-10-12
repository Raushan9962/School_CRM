import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  StatusBar,
  Modal
} from 'react-native';
import { LogOut, Menu, X, LucideIcon } from 'lucide-react-native';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

interface DashboardLayoutProps {
  title: string;
  roleName: string;
  userInfo: {
    name?: string;
    email?: string;
    role?: string;
    schoolName?: string;
  };
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  handleLogout: () => void;
  onSpecialNav?: (tabId: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  title,
  roleName,
  userInfo,
  navItems,
  activeTab,
  setActiveTab,
  handleLogout,
  onSpecialNav,
  drawerOpen,
  setDrawerOpen,
  children
}: DashboardLayoutProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top Navbar Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => setDrawerOpen(true)}
            style={styles.menuBtn}
            activeOpacity={0.7}
          >
            <Menu size={22} color="#ffffff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerBrand}>{userInfo?.schoolName || 'VidyaSetu'}</Text>
            <Text style={styles.headerRoleTitle}>{roleName} Portal</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleLogout} style={styles.headerIconBtn}>
            <LogOut size={18} color="#fca5a5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Nav Tabs (Web-like Navigation) */}
      <View style={styles.navBarScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navTabsRow}>
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            const IconC = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.isSpecial && onSpecialNav) {
                    onSpecialNav(item.id);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                style={[
                  styles.navTabItem,
                  isSelected && styles.navTabItemActive,
                  item.isSpecial && styles.specialTab
                ]}
                activeOpacity={0.7}
              >
                <IconC size={16} color={isSelected ? '#ea580c' : item.isSpecial ? '#ea580c' : '#64748b'} />
                <Text style={[
                  styles.navTabItemText,
                  isSelected && styles.navTabItemTextActive,
                  item.isSpecial && { color: '#ea580c', fontWeight: 'bold' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Page Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Web-Style Drawer Sidebar */}
      <Modal
        visible={drawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            activeOpacity={1} 
            onPress={() => setDrawerOpen(false)} 
          />
          <View style={styles.drawerSidebar}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerUserRow}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>
                    {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.drawerUserName} numberOfLines={1}>{userInfo?.name || 'User'}</Text>
                  <Text style={styles.drawerUserRole}>{roleName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setDrawerOpen(false)} style={styles.closeDrawerBtn}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerNavList}>
              <Text style={styles.drawerSectionLabel}>NAVIGATION MENU</Text>
              {navItems.map((item) => {
                const IconC = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.drawerItem, isSelected && styles.drawerItemActive]}
                    onPress={() => {
                      setDrawerOpen(false);
                      if (item.isSpecial && onSpecialNav) {
                        onSpecialNav(item.id);
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                  >
                    <IconC size={20} color={isSelected ? '#ea580c' : '#64748b'} />
                    <Text style={[styles.drawerItemText, isSelected && styles.drawerItemTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <TouchableOpacity 
                style={styles.drawerLogoutBtn} 
                onPress={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={18} color="#dc2626" />
                <Text style={styles.drawerLogoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#0f172a',
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRoleTitle: {
    fontSize: 12,
    color: '#ea580c',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  navBarScroll: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  navTabsRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  navTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navTabItemActive: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  specialTab: {
    borderColor: '#fdba74',
  },
  navTabItemText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  navTabItemTextActive: {
    color: '#ea580c',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  modalDismiss: {
    flex: 1,
  },
  drawerSidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    height: '100%',
    paddingTop: 44,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  drawerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  drawerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerAvatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  drawerUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  drawerUserRole: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  closeDrawerBtn: {
    padding: 6,
  },
  drawerNavList: {
    flex: 1,
    padding: 12,
  },
  drawerSectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 4,
  },
  drawerItemActive: {
    backgroundColor: '#fff7ed',
  },
  drawerItemText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: '#ea580c',
    fontWeight: 'bold',
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  drawerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  drawerLogoutText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
