const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/teacherPortalController.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace("exports.getParents = async (req, res) => {\\n    try {\\n        const schoolId = req.user.schoolId;", "exports.getParents = async (req, res) => {\\n    try {\\n        console.log('GET PARENTS CALLED', req.user);\\n        const schoolId = req.user.schoolId;");

fs.writeFileSync(file, content, 'utf8');
console.log("Added console log to getParents");
