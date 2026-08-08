const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Tailwind Gradients -> Solid Slate
    content = content.replace(/bg-gradient-to-r from-blue-600 to-indigo-600/g, "bg-slate-800");
    content = content.replace(/bg-gradient-to-r from-emerald-600 to-teal-600/g, "bg-slate-700");
    content = content.replace(/bg-gradient-to-r from-indigo-600 to-blue-600/g, "bg-slate-800");
    
    // Solid Tailwind Colors -> Slate
    content = content.replace(/bg-blue-600/g, "bg-slate-800");
    content = content.replace(/hover:bg-blue-700/g, "hover:bg-slate-900");
    
    content = content.replace(/text-blue-600/g, "text-slate-700");
    content = content.replace(/text-indigo-600/g, "text-slate-800");
    
    content = content.replace(/bg-blue-50/g, "bg-slate-50");
    content = content.replace(/bg-indigo-50/g, "bg-slate-100");
    
    content = content.replace(/border-blue-200/g, "border-slate-300");
    content = content.replace(/border-blue-500/g, "border-slate-500");
    content = content.replace(/focus:ring-blue-500/g, "focus:ring-slate-500");
    content = content.replace(/focus:border-blue-500/g, "focus:border-slate-500");

    // Inline Style Gradients & Colors -> Slate
    content = content.replace(/background: 'linear-gradient\(135deg, #6366f1, #8b5cf6\)'/g, "background: '#1e293b'");
    content = content.replace(/background: 'linear-gradient\(135deg, #4f46e5, #3b82f6\)'/g, "background: '#1e293b'");
    content = content.replace(/color: '#6366f1'/g, "color: '#334155'");
    content = content.replace(/color: '#4f46e5'/g, "color: '#1e293b'");
    content = content.replace(/color="#6366f1"/g, 'color="#334155"');
    content = content.replace(/color="#4f46e5"/g, 'color="#1e293b"');
    
    // Update SVG colors
    content = content.replace(/stroke="#6366f1"/g, 'stroke="#334155"');

    // Replace specific dashboard overview styles if they exist
    content = content.replace(/bg-indigo-50 text-indigo-600/g, "bg-slate-100 text-slate-700");

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Applied Gray/White Theme to ${file}`);
    }
});
