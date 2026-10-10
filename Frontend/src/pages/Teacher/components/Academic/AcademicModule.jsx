import React from 'react';
import ModuleContainer from '../../../../components/layout/ModuleContainer';
import ClassSchedule from './ClassSchedule';
import TeacherSchedule from './TeacherSchedule';
import TeacherPlanner from './TeacherPlanner';
import PeriodManagement from './PeriodManagement';

const AcademicModule = () => {
    const tabs = [
        { id: 'class_schedule', label: 'Class Schedule' },
        { id: 'teacher_schedule', label: 'Teacher Schedule' },
        { id: 'teacher_planner', label: 'Teacher Planner' },
        { id: 'period', label: 'Period' }
    ];

    const contentMap = {
        'class_schedule': <ClassSchedule />,
        'teacher_schedule': <TeacherSchedule />,
        'teacher_planner': <TeacherPlanner />,
        'period': <PeriodManagement />
    };

    return (
        <ModuleContainer
            tabs={tabs}
            contentMap={contentMap}
            defaultTab="class_schedule"
        />
    );
};

export default AcademicModule;
