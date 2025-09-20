// routes/exam.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getExams, createExam, updateExam, deleteExam } = require('../controllers/examController');

router.use(protect);

router.route('/')
    .get(getExams) // REMOVED authorization
    .post(authorize('Admin', 'Teacher'), createExam);

router.route('/:id')
    .put(authorize('Admin', 'Teacher'), updateExam)
    .delete(authorize('Admin', 'Teacher'), deleteExam);

module.exports = router;