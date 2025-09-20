// routes/notice.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getNotices, createNotice, deleteNotice, reactToNotice } = require('../controllers/noticeController');

router.use(protect);

// All roles can view/create notices and react
router.route('/')
    .get(getNotices)
    .post(createNotice);

router.route('/:noticeId/react')
    .post(reactToNotice);

// Only Admins or the author can delete
router.route('/:id')
    .delete(deleteNotice); // Logic to check author is inside the controller

module.exports = router;