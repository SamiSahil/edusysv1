// routes/subject.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');

router.use(protect);

router.route('/')
    .get(getSubjects) // REMOVED authorization
    .post(authorize('Admin'), createSubject);

router.route('/:id')
    .put(authorize('Admin'), updateSubject)
    .delete(authorize('Admin'), deleteSubject);

module.exports = router;