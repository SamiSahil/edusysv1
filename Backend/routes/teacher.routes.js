// in routes/teacher.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

const {
    getTeachers, createTeacher, getTeacherById,
    updateTeacher, deleteTeacher, bulkCreateTeachers, bulkDeleteTeachers
} = require('../controllers/teacherController');

router.use(protect);

router.route('/')
    .get(getTeachers) // REMOVED authorization
    .post(authorize('Admin'), upload.single('profileImage'), createTeacher);

router.post('/bulk', authorize('Admin'), bulkCreateTeachers);
router.delete('/bulk', authorize('Admin'), bulkDeleteTeachers);

router.route('/:id')
    .get(getTeacherById) // REMOVED authorization
    .put(authorize('Admin'), upload.single('profileImage'), updateTeacher)
    .delete(authorize('Admin'), deleteTeacher);

module.exports = router;