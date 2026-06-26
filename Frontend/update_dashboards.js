const fs = require('fs');

const adminFile = 'd:/Demo Office/MyDemo/School_CRM/Frontend/src/pages/SchoolAdmin/SchoolAdminDashboard.jsx';
const principalFile = 'd:/Demo Office/MyDemo/School_CRM/Frontend/src/pages/Principal/PrincipalDashboard.jsx';
const teacherFile = 'd:/Demo Office/MyDemo/School_CRM/Frontend/src/pages/Teacher/TeacherDashboard.jsx';

let content = fs.readFileSync(adminFile, 'utf8');

// Fix imports to point to SchoolAdmin/components
content = content.replace(/from '\.\/components\/([a-zA-Z0-9_]+)'/g, "from '../SchoolAdmin/components/$1'");
// Fix the PlaceholderView import
content = content.replace(/from '\.\.\/Principal\/components\/PlaceholderView'/g, "from '../Principal/components/PlaceholderView'");

// For Principal
let principalContent = content.replace(/SchoolAdminDashboard/g, 'PrincipalDashboard');
principalContent = principalContent.replace(/currentRole !== 'School Admin'/g, "currentRole !== 'Principal'");
principalContent = principalContent.replace(/role: 'School Administrator'/g, "role: 'Principal'");
fs.writeFileSync(principalFile, principalContent);

// For Teacher
let teacherContent = content.replace(/SchoolAdminDashboard/g, 'TeacherDashboard');
teacherContent = teacherContent.replace(/currentRole !== 'School Admin'/g, "currentRole !== 'teacher'");
teacherContent = teacherContent.replace(/role: 'School Administrator'/g, "role: 'Teacher'");
fs.writeFileSync(teacherFile, teacherContent);

console.log('Done rewriting dashboards!');
