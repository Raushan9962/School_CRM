const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/teacherPortalController.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed literal newlines");
