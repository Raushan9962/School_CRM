import React from 'react';

const SubNavTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="hide-scrollbar" style={{ 
            display: 'flex', gap: '8px', overflowX: 'auto', 
            paddingBottom: '16px', marginBottom: '16px',
            position: 'sticky', top: '-16px', zIndex: 30,
            backgroundColor: '#f4f7f6',
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
                            borderTop: isActive ? '3px solid #0ea5e9' : '1px solid #e2e8f0',
                            borderRadius: '4px',
                            padding: '16px 20px',
                            minWidth: '160px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <div style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                            {tab.label}
                        </div>
                        {tab.count !== undefined && (
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', textAlign: 'right' }}>
                                {tab.count}
                            </div>
                        )}
                        {tab.subtext && (
                            <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
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
