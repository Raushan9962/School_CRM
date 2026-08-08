const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Revert buttons from indigo to slate (Accountant style)
    content = content.replace(/bg-indigo-600/g, 'bg-slate-800');
    content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-slate-900');
    content = content.replace(/shadow-indigo-500\/30/g, 'shadow-slate-500/30');
    content = content.replace(/shadow-indigo-500\/25/g, 'shadow-slate-500/25');
    
    // Revert table hover rows from indigo to slate
    content = content.replace(/hover:bg-indigo-50\/40/g, 'hover:bg-slate-50/80');
    content = content.replace(/hover:bg-indigo-50\/30/g, 'hover:bg-slate-50/80');
    
    // Revert badges from indigo to slate
    content = content.replace(/bg-indigo-50/g, 'bg-slate-100');
    content = content.replace(/text-indigo-700/g, 'text-slate-700');
    content = content.replace(/border-indigo-100/g, 'border-slate-200');

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Reverted to Premium Slate on: ${file}`);
    }
});
