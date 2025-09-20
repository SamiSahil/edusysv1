// routes/timetable.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = require('../controllers/timetableController');

router.use(protect);

// All authenticated users can view the timetable
router.route('/')
    .get(getTimetable)
    .post(authorize('Admin'), createTimetableEntry);

router.route('/:id')
    .put(authorize('Admin'), updateTimetableEntry)
    .delete(authorize('Admin'), deleteTimetableEntry);

module.exports = router;