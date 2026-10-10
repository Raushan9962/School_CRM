import React from 'react';
import ModuleContainer from '../../../components/layout/ModuleContainer';
import LeaveList from './LeaveList';
import LeaveRequest from './LeaveRequest';

const LeaveModule = () => {
    const tabs = [
        { id: 'leave_list', label: 'My Application Leave List' },
        { id: 'leave_req', label: 'Leave Request' }
    ];

    const contentMap = {
        'leave_list': <LeaveList />,
        'leave_req': <LeaveRequest />
    };

    return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="leave_list" />;
};

export default LeaveModule;
