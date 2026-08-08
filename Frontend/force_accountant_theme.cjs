const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Catch ALL linear-gradient inline styles and replace with solid slate
    content = content.replace(/background:\s*'linear-gradient[^']*'/g, "background: '#1e293b'");
    
    // 2. Catch Tailwind gradients and replace with solid slate
    content = content.replace(/bg-gradient-to-r\s+from-[a-z]+-\d+\s+to-[a-z]+-\d+/g, "bg-slate-800");
    
    // 3. Catch stray Hex codes used for backgrounds/colors
    // Indigo/Blue variants
    content = content.replace(/#6366f1/gi, '#1e293b');
    content = content.replace(/#8b5cf6/gi, '#1e293b');
    content = content.replace(/#4f46e5/gi, '#1e293b');
    content = content.replace(/#3b82f6/gi, '#1e293b');
    // Red (Behavior Tracking button)
    content = content.replace(/#ef4444/gi, '#1e293b');
    content = content.replace(/#dc2626/gi, '#1e293b');
    // Emerald (Syllabus Tracking tick mark is okay to be green, but button?)
    // Let's leave #10b981 (emerald) for success indicators.
    
    // 4. Force uniform border radii for main action buttons if they have 16px, Attendance uses 16px for cards, 6px or 16px for buttons.
    // Attendance uses `borderRadius: '16px'` for cards, and `border: '1px solid #e2e8f0'`, `boxShadow: '0 4px 12px rgba(0,0,0,0.05)'`.
    // My previous script already set cards to 16px.
    
    // 5. Replace tailwind solid colors
    content = content.replace(/bg-blue-600/g, "bg-slate-800");
    content = content.replace(/hover:bg-blue-700/g, "hover:bg-slate-900");
    content = content.replace(/text-blue-600/g, "text-slate-800");
    content = content.replace(/text-indigo-600/g, "text-slate-800");

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Forced Accountant Theme on ${file}`);
    }
});
