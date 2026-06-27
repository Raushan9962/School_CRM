const fs = require('fs');
const path = require('path');

const replacements = [
    { regex: /\bp-6\b/g, replace: 'p-4' },
    { regex: /\bp-8\b/g, replace: 'p-5' },
    { regex: /\bgap-6\b/g, replace: 'gap-4' },
    { regex: /\brounded-2xl\b/g, replace: 'rounded-lg' },
    { regex: /\brounded-3xl\b/g, replace: 'rounded-xl' },
    { regex: /\btext-lg\b/g, replace: 'text-base' },
    { regex: /\btext-xl\b/g, replace: 'text-lg' },
    { regex: /\btext-2xl\b/g, replace: 'text-xl' },
    { regex: /\bpx-6 py-4\b/g, replace: 'px-4 py-2' },
    { regex: /\bpx-6 py-3\b/g, replace: 'px-4 py-2' },
    { regex: /\bmb-6\b/g, replace: 'mb-4' },
    { regex: /\bmt-6\b/g, replace: 'mt-4' },
    { regex: /\btext-base\b/g, replace: 'text-sm' }
];

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Exclude Accountant as it's already manually tuned perfectly
            if (file !== 'Accountant' && file !== 'components') {
                processDirectory(fullPath);
            } else if (file === 'components') {
                processDirectory(fullPath); // process components within subdirs
            }
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const { regex, replace } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replace);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDirectory('d:/Demo Office/MyDemo/School_CRM/Frontend/src/pages');
