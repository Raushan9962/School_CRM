const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/teacherPortalController.js');
let content = fs.readFileSync(file, 'utf8');

// replace s.name as student_name with su.name as student_name
content = content.replace(/s\.name as student_name/g, 'su.name as student_name');

// replace the JOIN clause
content = content.replace(/JOIN students s ON p\.student_id = s\.id\s+LEFT JOIN classes c/g, 'JOIN students s ON p.student_id = s.id\\n            JOIN users su ON s.user_id = su.id\\n            LEFT JOIN classes c');

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed getParents query via regex");
