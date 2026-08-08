const fs = require('fs');
const path = require('path');

const files = [
    'ExamManagement.jsx',
    'SyllabusTracking.jsx',
    'TeacherDiary.jsx',
    'StudentPerformance.jsx',
    'BehaviorTracking.jsx'
];

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';

files.forEach(file => {
    const filePath = path.join(basePath, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove gradients from buttons, use standard blue
    content = content.replace(/background: 'linear-gradient\(135deg, #6366f1, #8b5cf6\)'/g, "background: '#2563eb'");
    content = content.replace(/background: 'linear-gradient\(135deg, #ef4444, #dc2626\)'/g, "background: '#dc2626'");
    
    // Change large border radii to 8px
    content = content.replace(/borderRadius: '16px'/g, "borderRadius: '8px'");
    content = content.replace(/borderRadius: '14px'/g, "borderRadius: '8px'");
    content = content.replace(/borderRadius: '20px'/g, "borderRadius: '8px'");
    content = content.replace(/borderRadius: '10px'/g, "borderRadius: '8px'");
    content = content.replace(/borderRadius: '12px'/g, "borderRadius: '8px'");
    
    // Tailwind classes replacements
    content = content.replace(/rounded-xl/g, "rounded");
    content = content.replace(/rounded-lg/g, "rounded");
    content = content.replace(/rounded-2xl/g, "rounded");
    
    // Simplify shadows
    content = content.replace(/boxShadow: '0 2px 8px rgba\(0,0,0,0\.06\)'/g, "boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'");
    content = content.replace(/boxShadow: '0 2px 6px rgba\(0,0,0,0\.04\)'/g, "boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'");
    content = content.replace(/boxShadow: '0 4px 12px rgba\([^\)]+\)'/g, "boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'");
    content = content.replace(/boxShadow: '0 8px 24px rgba\([^\)]+\)'/g, "boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
