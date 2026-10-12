import React, { useState, useEffect } from 'react';
import SubNavTabs from './SubNavTabs';

const ModuleContainer = ({ tabs, contentMap, defaultTab, activeTab: controlledTab, onTabChange }) => {
    const [internalSubTab, setInternalSubTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : null));
    const activeSubTab = controlledTab !== undefined ? controlledTab : internalSubTab;

    const handleTabChange = (id) => {
        setInternalSubTab(id);
        if (onTabChange) onTabChange(id);
    };

    useEffect(() => {
        if (!tabs || tabs.length === 0) return;
        
        const isValid = tabs.some(t => t.id === activeSubTab);
        if (!isValid) {
            handleTabChange(defaultTab || tabs[0].id);
        }
    }, [tabs, defaultTab, activeSubTab]);

    const renderContent = () => {
        if (!activeSubTab || !contentMap[activeSubTab]) {
            return <div style={{ padding: '24px', color: '#64748b' }}>Select a tab to view content</div>;
        }
        return contentMap[activeSubTab];
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <SubNavTabs
                tabs={tabs}
                activeTab={activeSubTab}
                onTabChange={handleTabChange}
            />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default ModuleContainer;
