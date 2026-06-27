import React from 'react';

const SubNavTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="hide-scrollbar" style={{ 
            display: 'flex', gap: '8px', overflowX: 'auto', 
            paddingBottom: '16px', marginBottom: '16px',
            position: 'sticky', top: '-16px', zIndex: 30,
            backgroundColor: '#f8fafc',
            paddingTop: '16px',
            marginTop: '-16px'
        }}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <div
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            background: isActive ? '#f0f9ff' : '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderTop: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                            borderRadius: '6px',
                            padding: '12px 16px',
                            minWidth: '140px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            transition: 'all 0.2s',
                            boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                            boxSizing: 'border-box' // Ensure padding/borders don't affect width/height unexpectedly
                        }}
                        className="hover:border-blue-200"
                    >
                        <div style={{ fontSize: '13px', color: isActive ? '#1e293b' : '#475569', fontWeight: 'bold' }}>
                            {tab.label}
                        </div>
                        {tab.count !== undefined && (
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>
                                {tab.count}
                            </div>
                        )}
                        {tab.subtext && (
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                                {tab.subtext}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SubNavTabs;
