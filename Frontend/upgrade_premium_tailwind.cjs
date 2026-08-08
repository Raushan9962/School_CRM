const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove inline styles that ruin the look
    content = content.replace(/style={{[^}]*}}/g, '');

    // Upgrade Cards & Containers
    // Assuming most main containers have `bg-white rounded-xl shadow` or similar basic tailwind classes
    content = content.replace(/bg-white\s+rounded-?\w*\s+border\s+border-slate-200(\s+shadow-?\w*)?/g, 'bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300');
    content = content.replace(/bg-white\s+p-\d+\s+rounded-?\w*\s+shadow-?\w*/g, 'bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 p-6');

    // Upgrade Primary Buttons (Slate/Indigo)
    content = content.replace(/bg-slate-800\s+hover:bg-slate-900\s+text-white\s+rounded-?\w*\s+px-\d+\s+py-\d+/g, 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 font-semibold text-sm shadow-sm hover:shadow-indigo-500/30 transition-all duration-300');
    content = content.replace(/bg-slate-800\s+text-white\s+px-\d+\s+py-\d+\s+rounded-?\w*/g, 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 font-semibold text-sm shadow-sm hover:shadow-indigo-500/30 transition-all duration-300');

    // Upgrade Tables
    content = content.replace(/bg-slate-50\s+border-b\s+border-slate-200/g, 'bg-slate-50/80 border-b border-slate-200 uppercase text-xs tracking-wider');
    content = content.replace(/hover:bg-slate-50\/50/g, 'hover:bg-indigo-50/40 transition-colors');
    content = content.replace(/hover:bg-slate-50/g, 'hover:bg-indigo-50/40 transition-colors');

    // Upgrade Typography (Headers)
    content = content.replace(/text-lg\s+md:text-xl\s+font-bold\s+text-slate-900/g, 'text-xl font-bold text-slate-800 tracking-tight');
    content = content.replace(/text-xl\s+font-bold\s+text-slate-800/g, 'text-xl font-bold text-slate-800 tracking-tight');
    
    // Add nice gap/flex structures to the main wrapper if they are block
    if (content.includes('className="flex flex-col gap-5"')) {
        content = content.replace(/className="flex flex-col gap-5"/, 'className="flex flex-col gap-6 animate-fade-in"');
    }

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Premium Tailwind Applied to: ${file}`);
    }
});
