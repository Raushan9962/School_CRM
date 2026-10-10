const fs = require('fs');
const path = require('path');

const dirs = [
    'd:/Demo Office/MyDemo/School_CRM/Frontend/src/pages/Teacher/components/Academic',
    'd:/Demo Office/MyDemo/School_CRM/Frontend/src/pages/shared/HumanResource'
];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content
                .replace(/bg-indigo-600/g, 'bg-slate-900')
                .replace(/hover:bg-indigo-700/g, 'hover:bg-slate-800')
                .replace(/text-indigo-600/g, 'text-slate-900')
                .replace(/focus:ring-indigo-500/g, 'focus:ring-slate-900')
                .replace(/focus:border-indigo-500/g, 'focus:border-slate-900')
                .replace(/border-indigo-600/g, 'border-slate-900')
                .replace(/bg-indigo-100/g, 'bg-slate-100')
                .replace(/bg-blue-50/g, 'bg-slate-100')
                .replace(/text-blue-600/g, 'text-slate-900')
                .replace(/hover:text-indigo-600/g, 'hover:text-slate-900');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated colors in ${fullPath}`);
            }
        }
    }
}

dirs.forEach(processDir);
console.log("Color replacement done.");
