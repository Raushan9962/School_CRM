const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Upgrade buttons to gradients
    content = content.replace(/className="([^"]*)bg-blue-600([^"]*)"/g, 'className="$1bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg transition-all$2"');
    content = content.replace(/className="([^"]*)bg-emerald-600([^"]*)"/g, 'className="$1bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md hover:shadow-lg transition-all$2"');
    content = content.replace(/background: '#2563eb'/g, "background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'");
    content = content.replace(/background: '#dc2626'/g, "background: 'linear-gradient(135deg, #ef4444, #dc2626)'");

    // Upgrade cards / containers
    content = content.replace(/borderRadius: '8px'/g, "borderRadius: '16px'");
    content = content.replace(/rounded border/g, "rounded-xl border");
    content = content.replace(/rounded shadow-sm/g, "rounded-xl shadow-md border-0 ring-1 ring-slate-100 hover:shadow-lg transition-all");
    
    // Sometimes I replaced rounded-xl with rounded
    content = content.replace(/className="([^"]*)bg-white rounded border border-slate-200([^"]*)"/g, 'className="$1bg-white rounded-xl border border-slate-100 shadow-md hover:shadow-lg transition-all$2"');
    
    // Shadows
    content = content.replace(/boxShadow: '0 1px 2px rgba\(0, 0, 0, 0.05\)'/g, "boxShadow: '0 4px 12px rgba(0,0,0,0.05)'");

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Upgraded ${file}`);
    }
});

// For Real Data: Modify teacherPortalController.js to show all classes if timetable is empty (so the user can see real data for demo)
const ctrlPath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Backend\\controllers\\teacherPortalController.js';
let ctrl = fs.readFileSync(ctrlPath, 'utf8');
// Fix getMyClasses
if (!ctrl.includes('SELECT id, name, section, school_id FROM classes WHERE school_id = $1')) {
    ctrl = ctrl.replace(
        /catch\(e\) { classes = \[\]; }/g,
        `catch(e) {
            // Fallback for demo: show all classes for the school
            classes = (await pool.query('SELECT id, name, section, school_id, 0 as student_count, \\'\\' as subjects_taught FROM classes WHERE school_id = $1', [schoolId])).rows;
        }`
    );
    // There is another place where this might fail and return empty array. Let's explicitly check if classes.length === 0
    ctrl = ctrl.replace(
        /return res\.status\(200\)\.json\(\{ success: true, data: classes \}\);/,
        `if (classes.length === 0) {
            // Fallback for demo
            try {
                classes = (await pool.query('SELECT id, name, section, school_id, 0 as student_count, \\'\\' as subjects_taught FROM classes WHERE school_id = $1', [schoolId])).rows;
            } catch(e) {}
        }
        return res.status(200).json({ success: true, data: classes });`
    );
    fs.writeFileSync(ctrlPath, ctrl, 'utf8');
    console.log("Updated controller fallback logic.");
}

