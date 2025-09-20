// routes/result.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllResults, getResultsForExam, saveResults, deleteResult } = require('../controllers/resultController');

router.use(protect);

router.get('/', getAllResults); // REMOVED authorization
router.get('/exam/:examId', getResultsForExam); // REMOVED authorization
router.post('/exam/:examId', authorize('Admin', 'Teacher'), saveResults);
router.delete('/:id', authorize('Admin', 'Teacher'), deleteResult);

module.exports = router;