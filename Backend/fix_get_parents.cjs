const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/teacherPortalController.js');
let content = fs.readFileSync(file, 'utf8');

const target = `SELECT 
                p.id as parent_id, 
                u.name as parent_name, 
                u.email, 
                u.phone,
                s.name as student_name,
                c.name as class_name,
                c.section`;

const replacement = `SELECT 
                p.id as parent_id, 
                u.name as parent_name, 
                u.email, 
                u.phone,
                su.name as student_name,
                c.name as class_name,
                s.section`;

const targetJoins = `FROM parents p
            JOIN users u ON p.user_id = u.id
            JOIN students s ON p.student_id = s.id
            LEFT JOIN classes c ON s.class_id = c.id`;

const replacementJoins = `FROM parents p
            JOIN users u ON p.user_id = u.id
            JOIN students s ON p.student_id = s.id
            JOIN users su ON s.user_id = su.id
            LEFT JOIN classes c ON s.class_id = c.id`;

content = content.replace(target, replacement);
content = content.replace(targetJoins, replacementJoins);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed getParents query");
