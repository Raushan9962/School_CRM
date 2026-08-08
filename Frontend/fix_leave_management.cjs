const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
let lmPath = path.join(basePath, 'LeaveManagement.jsx');
let content = fs.readFileSync(lmPath, 'utf8');

// Fix styling
content = content.replace(/bg-indigo-600/g, "bg-slate-800");
content = content.replace(/hover:bg-indigo-700/g, "hover:bg-slate-900");
content = content.replace(/focus:border-indigo-500/g, "focus:border-slate-500");
content = content.replace(/focus:ring-indigo-500\/20/g, "focus:ring-slate-500/20");

// Inject dummy data
if (!content.includes('dummy data flag for leaves')) {
    content = content.replace(
        /if \(data\.success\) setLeaves\(data\.data\);/,
        `if (data.success) {
            if (data.data.length === 0) {
                // dummy data flag for leaves
                setLeaves([
                    { id: 1, leave_type: 'Casual Leave', start_date: '2026-06-10', end_date: '2026-06-11', reason: 'Personal work at home.', status: 'Approved', created_at: '2026-06-08' },
                    { id: 2, leave_type: 'Medical Leave', start_date: '2026-07-22', end_date: '2026-07-24', reason: 'Viral fever.', status: 'Approved', created_at: '2026-07-21' },
                    { id: 3, leave_type: 'Casual Leave', start_date: '2026-08-15', end_date: '2026-08-16', reason: 'Attending a family function.', status: 'Pending', created_at: '2026-08-05' }
                ]);
            } else {
                setLeaves(data.data);
            }
        }`
    );
    // Handle error case
    content = content.replace(
        /console\.error\('Failed to fetch leaves', e\);/,
        `console.error('Failed to fetch leaves', e);
        setLeaves([
            { id: 1, leave_type: 'Casual Leave', start_date: '2026-06-10', end_date: '2026-06-11', reason: 'Personal work at home.', status: 'Approved', created_at: '2026-06-08' },
            { id: 2, leave_type: 'Medical Leave', start_date: '2026-07-22', end_date: '2026-07-24', reason: 'Viral fever.', status: 'Approved', created_at: '2026-07-21' }
        ]);`
    );
}

fs.writeFileSync(lmPath, content, 'utf8');
console.log("Fixed LeaveManagement styling and dummy data.");
