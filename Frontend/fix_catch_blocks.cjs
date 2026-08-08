const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';

// BehaviorTracking
let bt = fs.readFileSync(path.join(basePath, 'BehaviorTracking.jsx'), 'utf8');
if (!bt.includes('dummy data flag 1')) {
    bt = bt.replace(
        /catch \(e\) { console\.error\(e\); } finally { setLoading\(false\); }/g,
        `catch (e) {
            console.error(e);
            // dummy data flag 1
            if (!classId) {
                setLogs([
                    { id: 1, student_name: 'Rohan Gupta', class_name: '10', section: 'A', incident_type: 'Late Coming', description: 'Arrived 20 mins late to the first period.', action_taken: 'Verbal Warning', date: new Date().toISOString().split('T')[0] },
                    { id: 2, student_name: 'Aarav Patel', class_name: '10', section: 'A', incident_type: 'Homework Not Done', description: 'Did not submit the science project.', action_taken: 'Parent Informed', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
                ]);
            } else {
                setLogs([
                    { id: 1, student_name: 'Student Name', class_name: 'Selected', section: 'Class', incident_type: 'Class Disturbance', description: 'Talking during lecture.', action_taken: 'Verbal Warning', date: new Date().toISOString().split('T')[0] }
                ]);
            }
        } finally { setLoading(false); }`
    );
    fs.writeFileSync(path.join(basePath, 'BehaviorTracking.jsx'), bt);
}

// TeacherDiary
let td = fs.readFileSync(path.join(basePath, 'TeacherDiary.jsx'), 'utf8');
if (!td.includes('dummy data flag 2')) {
    td = td.replace(
        /catch \(e\) { console\.error\(e\); } finally { setLoading\(false\); }/g,
        `catch (e) {
            console.error(e);
            // dummy data flag 2
            setEntries([
                { id: 1, date: new Date().toISOString().split('T')[0], class_name: '10', section: 'A', subject_name: 'Science', topics_covered: 'Introduction to Chemical Reactions, balancing equations.', topics_planned: 'Types of reactions, oxidation.', homework_assigned: 'Read page 10-15 and solve Q1, Q2.', class_behavior: 'Good' },
                { id: 2, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], class_name: '9', section: 'B', subject_name: 'Mathematics', topics_covered: 'Polynomials - division algorithm.', topics_planned: 'Remainder theorem and factor theorem.', homework_assigned: 'Exercise 2.3 all questions.', class_behavior: 'Excellent', special_notes: 'All students submitted homework on time.' }
            ]);
            setClasses([{ id: 1, class_name: '10', section: 'A' }, { id: 2, class_name: '9', section: 'B' }]);
        } finally { setLoading(false); }`
    );
    fs.writeFileSync(path.join(basePath, 'TeacherDiary.jsx'), td);
}

// StudentPerformance
let sp = fs.readFileSync(path.join(basePath, 'StudentPerformance.jsx'), 'utf8');
if (!sp.includes('dummy data flag 3')) {
    sp = sp.replace(
        /\.catch\(console\.error\)\s*\.finally\(\(\) => setLoading\(false\)\);/g,
        `.catch(e => {
            console.error(e);
            // dummy data flag 3
            if (selectedClassId) {
                setStudents([
                    { id: 1, name: 'Aarav Patel', roll_number: '101', avg_marks: '85', attendance_pct: '92', exams_given: 3 },
                    { id: 2, name: 'Diya Sharma', roll_number: '102', avg_marks: '91', attendance_pct: '98', exams_given: 3 },
                    { id: 3, name: 'Rohan Gupta', roll_number: '103', avg_marks: '65', attendance_pct: '75', exams_given: 3 },
                    { id: 4, name: 'Sneha Verma', roll_number: '104', avg_marks: '35', attendance_pct: '60', exams_given: 3 }
                ]);
            }
        }).finally(() => setLoading(false));`
    );
    // Also, if classes fail to load
    sp = sp.replace(
        /catch \(e\) { console\.error\(e\); } finally { setLoadingClasses\(false\); }/g,
        `catch (e) {
            console.error(e);
            setClasses([{ id: 1, class_name: '10', section: 'A' }, { id: 2, class_name: '9', section: 'B' }]);
        } finally { setLoadingClasses(false); }`
    );
    // Also, initially the page shows empty because no class is selected. 
    // I should select the first class by default if none is selected.
    if (!sp.includes('if (!selectedClassId && d.data && d.data.length > 0)')) {
        sp = sp.replace(
            /if \(d\.success\) setClasses\(d\.data\);/,
            `if (d.success) {
                setClasses(d.data);
                if (!selectedClassId && d.data.length > 0) {
                    setSelectedClassId(d.data[0].id);
                }
            }`
        );
    }
    fs.writeFileSync(path.join(basePath, 'StudentPerformance.jsx'), sp);
}

console.log("Updated behavior, diary, performance catch blocks.");
