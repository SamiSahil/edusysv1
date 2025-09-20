// routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAttendanceForSectionAndDate,
    getSectionAttendanceReport,
    getStudentAttendanceReport,
    saveAttendance
} = require('../controllers/attendanceController');

// Protect all routes in this file
router.use(protect);

// Only Admins and Teachers can manage or view attendance
router.post('/', authorize('Admin', 'Teacher'), saveAttendance);
router.get('/:sectionId/:date', authorize('Admin', 'Teacher'), getAttendanceForSectionAndDate);
router.get('/report/section/:sectionId', authorize('Admin', 'Teacher'), getSectionAttendanceReport);

// A Student can view their own report, Admins/Teachers can view any
router.get('/report/student/:studentId', authorize('Admin', 'Teacher', 'Student'), getStudentAttendanceReport);

module.exports = router;