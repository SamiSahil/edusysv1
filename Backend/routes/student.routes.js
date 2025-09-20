// in routes/student.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

const {
    getStudents, createStudent, getStudentById,
    updateStudent, deleteStudent, bulkCreateStudents, bulkDeleteStudents
} = require('../controllers/studentController');

router.use(protect);

router.route('/')
    .get(getStudents) // REMOVED authorization
    .post(authorize('Admin'), upload.single('profileImage'), createStudent);

router.post('/bulk', authorize('Admin'), bulkCreateStudents);
router.delete('/bulk', authorize('Admin'), bulkDeleteStudents);

router.route('/:id')
    .get(getStudentById) // REMOVED authorization
    .put(authorize('Admin'), updateStudent)
    .delete(authorize('Admin'), deleteStudent);

module.exports = router;