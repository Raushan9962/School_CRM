import React, { useState } from 'react';
import ModuleContainer from '../../../components/layout/ModuleContainer';
import LeaveList from './LeaveList';
import LeaveRequest from './LeaveRequest';

const LeaveModule = () => {
    const [activeSubTab, setActiveSubTab] = useState('leave_list');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
        setTimeout(() => {
            setActiveSubTab('leave_list');
        }, 1200);
    };

    const tabs = [
        { id: 'leave_list', label: 'My Application Leave List' },
        { id: 'leave_req', label: 'Leave Request' }
    ];

    const contentMap = {
        'leave_list': <LeaveList key={refreshKey} />,
        'leave_req': <LeaveRequest onSuccess={handleSuccess} />
    };

    return (
        <ModuleContainer 
            tabs={tabs} 
            contentMap={contentMap} 
            activeTab={activeSubTab} 
            onTabChange={setActiveSubTab} 
            defaultTab="leave_list" 
        />
    );
};

export default LeaveModule;
