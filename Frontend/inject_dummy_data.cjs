const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';

// Fix Timetable
let tt = fs.readFileSync(path.join(basePath, 'TeacherTimetable.jsx'), 'utf8');
if (!tt.includes('dummy data flag')) {
    tt = tt.replace(
        /if \(data.success\) setSchedule\(data.data\);/g,
        `if (data.success && data.data && data.data.length > 0) {
            setSchedule(data.data);
        } else {
            // dummy data flag
            setSchedule([
                { id: 1, day_of_week: 'Monday', start_time: '08:00:00', end_time: '08:45:00', subject_name: 'Mathematics', class_name: '10', section: 'A' },
                { id: 2, day_of_week: 'Monday', start_time: '08:45:00', end_time: '09:30:00', subject_name: 'Science', class_name: '9', section: 'B' },
                { id: 3, day_of_week: 'Tuesday', start_time: '10:00:00', end_time: '10:45:00', subject_name: 'Physics', class_name: '11', section: 'A' }
            ]);
        }`
    );
    tt = tt.replace(/catch \(e\) { console\.error\(e\); }/g, 
        `catch (e) { 
            console.error(e); 
            setSchedule([
                { id: 1, day_of_week: 'Monday', start_time: '08:00:00', end_time: '08:45:00', subject_name: 'Mathematics', class_name: '10', section: 'A' },
                { id: 2, day_of_week: 'Monday', start_time: '08:45:00', end_time: '09:30:00', subject_name: 'Science', class_name: '9', section: 'B' }
            ]);
        }`);
    fs.writeFileSync(path.join(basePath, 'TeacherTimetable.jsx'), tt);
}

// Fix ParentInteraction
let pt = fs.readFileSync(path.join(basePath, 'ParentInteraction.jsx'), 'utf8');
if (!pt.includes('dummy data pt')) {
    pt = pt.replace(
        /if \(data.success\) setStudents\(data.data\);/g,
        `if (data.success && data.data && data.data.length > 0) {
            setStudents(data.data);
        } else {
            // dummy data pt
            setStudents([
                { id: 1, name: 'Aarav Patel', roll_number: '101', parent_name: 'Rajesh Patel', parent_phone: '+91 9876543210' },
                { id: 2, name: 'Diya Sharma', roll_number: '102', parent_name: 'Suresh Sharma', parent_phone: '+91 9876543211' }
            ]);
        }`
    );
    pt = pt.replace(/catch \(e\) { console\.error\(e\); }/g, 
        `catch (e) { 
            console.error(e); 
            setStudents([
                { id: 1, name: 'Aarav Patel', roll_number: '101', parent_name: 'Rajesh Patel', parent_phone: '+91 9876543210' },
                { id: 2, name: 'Diya Sharma', roll_number: '102', parent_name: 'Suresh Sharma', parent_phone: '+91 9876543211' }
            ]);
        }`);
    fs.writeFileSync(path.join(basePath, 'ParentInteraction.jsx'), pt);
}

console.log("Updated Parent & PTM and Timetable with dummy data.");
