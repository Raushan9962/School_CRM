const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

const fixedFiles = ['DashboardOverview.jsx', 'AttendanceManagement.jsx', 'SyllabusTracking.jsx'];

files.forEach(file => {
    if (fixedFiles.includes(file)) return;
    
    let filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix empty layout containers
    content = content.replace(/<div\s*>\s*<h2\s*>/g, '<div className="flex justify-between items-center mb-6">\n<h2 className="text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">');
    
    // Header Titles & Subtitles
    content = content.replace(/<h2\s*>/g, '<h2 className="text-2xl font-bold text-slate-800 m-0 mb-1">');
    content = content.replace(/<p\s*>Manage/g, '<p className="text-slate-500 text-sm mb-6 m-0">Manage');
    content = content.replace(/<p\s*>View/g, '<p className="text-slate-500 text-sm mb-6 m-0">View');
    
    // Action Buttons (Dark Navy)
    content = content.replace(/<button\s*>\s*<Plus/g, '<button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 shadow-sm transition-all"><Plus');
    content = content.replace(/<button\s*>\s*\+ Add/g, '<button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 shadow-sm transition-all">+ Add');

    // Summary Cards (Blue Border)
    content = content.replace(/<div\s*>\s*<div\s*>\s*<Users/g, '<div className="border border-blue-400 rounded-lg p-5 flex items-center gap-4 bg-white shadow-sm mb-6">\n<div className="bg-blue-50 text-blue-600 rounded-md p-3 flex items-center justify-center"><Users');
    content = content.replace(/<div\s*>\s*<div\s*>\s*<BookOpen/g, '<div className="border border-blue-400 rounded-lg p-5 flex items-center gap-4 bg-white shadow-sm mb-6">\n<div className="bg-blue-50 text-blue-600 rounded-md p-3 flex items-center justify-center"><BookOpen');
    
    // Table Structure
    content = content.replace(/<table\s*>/g, '<div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"><table className="w-full text-left border-collapse min-w-[600px]">');
    content = content.replace(/<\/table>/g, '</table></div>');
    
    content = content.replace(/<thead\s*>/g, '<thead className="bg-slate-50 border-b border-slate-200">');
    content = content.replace(/<th\s*>/g, '<th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">');
    
    content = content.replace(/<tr\s*>/g, '<tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">');
    content = content.replace(/<td\s*>/g, '<td className="px-5 py-4 text-sm font-semibold text-slate-700">');
    
    // Action Links (Blue)
    content = content.replace(/<button\s*>\s*View/g, '<button className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors flex items-center gap-1">View');
    
    // Generic fixes for empty tags
    content = content.replace(/<div\s*>/g, '<div className="flex flex-col gap-2">');

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Applied Accountant UI to: ${file}`);
    }
});
