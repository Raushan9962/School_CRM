const fs = require('fs');
let c = fs.readFileSync('PrincipalDashboard.jsx', 'utf8');

c = c.replace(
    "import { LayoutDashboard, Users, BookOpen, GraduationCap, CalendarCheck, CalendarDays, BarChart3, Settings, Bell, FileText, Bus, CheckSquare, AlertTriangle, MessageSquare } from 'lucide-react';",
    "import { LayoutDashboard, Users, BookOpen, GraduationCap, CalendarCheck, CalendarDays, BarChart3, Settings, Bell, FileText, Bus, CheckSquare, AlertTriangle, MessageSquare, ClipboardList } from 'lucide-react';"
);

c = c.replace(
    "import GrievanceSystem from './components/GrievanceSystem';",
    "import GrievanceSystem from './components/GrievanceSystem';\nimport LeaveModule from '../shared/HumanResource/LeaveModule';"
);

c = c.replace(
    "{ id: 'leave', label: 'Leave Management', icon: <CalendarDays size={20} strokeWidth={1.5} /> },",
    "{ id: 'leave', label: 'Staff Leaves (Approval)', icon: <CalendarDays size={20} strokeWidth={1.5} /> },\n        { id: 'hr_leaves', label: 'Human Resource (Leave)', icon: <ClipboardList size={20} strokeWidth={1.5} /> },"
);

c = c.replace(
    "if (activeTab === 'tasks') {",
    "if (activeTab === 'hr_leaves') return <LeaveModule />;\n\n        if (activeTab === 'tasks') {"
);

fs.writeFileSync('PrincipalDashboard.jsx', c);
