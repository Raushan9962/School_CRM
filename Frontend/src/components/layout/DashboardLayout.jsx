import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ 
    navItems, 
    activeTab, 
    setActiveTab, 
    userInfo, 
    handleLogout, 
    sidebarBottomContent,
    children 
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [openMenus, setOpenMenus] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-open menus that contain the active tab
    useEffect(() => {
        const newOpenMenus = { ...openMenus };
        let changed = false;

        const findAndOpenParent = (items, parentId = null) => {
            for (const item of items) {
                if (item.id === activeTab && parentId) {
                    if (!newOpenMenus[parentId]) {
                        newOpenMenus[parentId] = true;
                        changed = true;
                    }
                }
                if (item.subItems) {
                    findAndOpenParent(item.subItems, item.id);
                }
            }
        };

        findAndOpenParent(navItems);
        if (changed) {
            setOpenMenus(newOpenMenus);
        }
    }, [activeTab, navItems]);

    const toggleMenu = (id, e) => {
        if(e) e.stopPropagation();
        setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getActiveTitle = () => {
        let currentTitle = 'Dashboard Overview';
        const searchItems = (items) => {
            for (const item of items) {
                if (item.id === activeTab) {
                    currentTitle = item.label;
                    return true;
                }
                if (item.subItems) {
                    if (searchItems(item.subItems)) {
                        currentTitle = `${item.label} / ${currentTitle}`;
                        return true;
                    }
                }
            }
            return false;
        };
        searchItems(navItems);
        return currentTitle;
    };

    const renderNavItems = (items) => {
        return items.map(item => {
            const isSelected = activeTab === item.id;
            
            return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                        onClick={(e) => {
                            setActiveTab(item.id);
                            if (isMobile) {
                                setIsSidebarOpen(false);
                            }
                        }}
                        style={{
                            width: '100%', textAlign: 'left', 
                            padding: '12px 14px',
                            borderRadius: '8px', border: 'none', cursor: 'pointer',
                            fontSize: 14, 
                            fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: isSelected ? '#e0f2fe' : 'transparent', // Light blue background for active
                            color: isSelected ? '#0284c7' : '#475569', // Blue text for active, slate for others
                            transition: 'all 0.2s ease',
                            marginTop: '4px',
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f1f5f9' }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                        {item.icon && <span style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}>{item.icon}</span>}
                        {/* If no icon but depth is 0, add a placeholder spacing to align text */}
                        {!item.icon && <span style={{ width: '20px' }}></span>}
                        
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label.replace(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/, '')}</span>
                    </button>
                </div>
            );
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: 260,
                minWidth: 260,
                position: isMobile ? 'fixed' : 'relative',
                left: isMobile ? (isSidebarOpen ? 0 : -260) : 'auto',
                marginLeft: !isMobile && !isSidebarOpen ? -260 : 0,
                top: 0, bottom: 0,
                height: '100vh',
                overflow: 'hidden', background: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column',
                borderRight: '1px solid #e2e8f0', zIndex: 50
            }}>
                <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: '#fbbf24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        {userInfo?.name ? userInfo.name.substring(0, 2).toUpperCase() : 'PR'}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h2 style={{ color: '#1e293b', margin: 0, fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {userInfo?.name || 'Preksha Gupta'}
                        </h2>
                    </div>
                </div>

                <div style={{ padding: '0 20px 12px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {userInfo?.schoolName || 'SCHOOL CRM'}
                </div>

                <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {renderNavItems(navItems)}
                    </div>
                    {sidebarBottomContent}
                </nav>

                <div style={{ padding: '20px 16px', borderTop: '1px solid #e2e8f0' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{ 
                    background: '#ffffff', 
                    padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    borderBottom: '1px solid #e2e8f0', zIndex: 5 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: 16, cursor: 'pointer', color: '#64748b', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background='none'}>
                            {isSidebarOpen ? '❮' : '❯'}
                        </button>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#1e293b' }}>{getActiveTitle().split(' / ').pop()}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            <Bell size={20} strokeWidth={1.5} color="#475569" />
                            <span style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div style={{ flex: 1, padding: isMobile ? '16px 12px' : 24, overflowY: 'auto' }}>
                    <div style={{ margin: '0 auto', maxWidth: '100%' }}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
