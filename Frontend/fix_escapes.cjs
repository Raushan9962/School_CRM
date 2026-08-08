const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const filesToFix = ['SyllabusTracking.jsx', 'AttendanceManagement.jsx'];

filesToFix.forEach(file => {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the accidental escape slashes on $ and ` 
    // that were caused by writing the file directly.
    content = content.replace(/\\\$/g, '$');
    content = content.replace(/\\`/g, '`');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed parsing errors in ${file}`);
});
