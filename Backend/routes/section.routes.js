// routes/section.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getSections, createSection, updateSection, deleteSection } = require('../controllers/sectionController');

router.use(protect);

router.route('/')
    .get(getSections) // REMOVED authorization
    .post(authorize('Admin'), createSection);

router.route('/:id')
    .put(authorize('Admin'), updateSection)
    .delete(authorize('Admin'), deleteSection);

module.exports = router;