const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teacherPortalController');
const { auth, restrictTo } = require('../middleware/auth');

const isTeacher = [auth, restrictTo('Teacher')];

// Phase 1
router.get('/profile', ...isTeacher, ctrl.getProfile);
router.get('/dashboard-stats', ...isTeacher, ctrl.getDashboardStats);
router.get('/my-classes', ...isTeacher, ctrl.getMyClasses);
router.get('/class-students/:classId', ...isTeacher, ctrl.getClassStudents);
router.post('/submit-attendance', ...isTeacher, ctrl.submitAttendance);
router.get('/leaves', ...isTeacher, ctrl.getMyLeaves);
router.post('/leaves', ...isTeacher, ctrl.applyLeave);
router.post('/mark-attendance-qr', ...isTeacher, ctrl.markAttendanceQR);
router.get('/my-timetable', ...isTeacher, ctrl.getMyTimetable);

// Phase 2 - Academic Core
router.get('/exams', ...isTeacher, ctrl.getMyExams);
router.get('/exam-students/:examId', ...isTeacher, ctrl.getExamStudents);
router.post('/save-marks', ...isTeacher, ctrl.saveMarks);
router.get('/assignments', ...isTeacher, ctrl.getMyAssignments);
router.post('/assignments', ...isTeacher, ctrl.createAssignment);
router.get('/syllabus', ...isTeacher, ctrl.getSyllabusProgress);
router.post('/syllabus', ...isTeacher, ctrl.updateSyllabusProgress);
router.get('/diary', ...isTeacher, ctrl.getMyDiary);
router.post('/diary', ...isTeacher, ctrl.submitDiaryEntry);

// Phase 3 - Communication, Analytics & Behavior
router.get('/student-performance', ...isTeacher, ctrl.getStudentPerformance);
router.post('/student-remark', ...isTeacher, ctrl.addStudentRemark);
router.get('/behavior-log', ...isTeacher, ctrl.getBehaviorLog);
router.post('/behavior-log', ...isTeacher, ctrl.addBehaviorLog);
router.get('/ptm-meetings', ...isTeacher, ctrl.getPTMMeetings);
router.post('/ptm-meetings', ...isTeacher, ctrl.schedulePTM);
router.get('/students-by-class', ...isTeacher, ctrl.getStudentsByClass);

module.exports = router;
