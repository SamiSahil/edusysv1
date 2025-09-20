// in routes/staff.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

const {
    getStaffs, createStaff, getStaffById,
    updateStaff, deleteStaff, bulkCreateStaffs, bulkDeleteStaffs
} = require('../controllers/staffController');

router.use(protect);

router.route('/')
    .get(getStaffs) // REMOVED authorization
    .post(authorize('Admin'), upload.single('profileImage'), createStaff);

router.post('/bulk', authorize('Admin'), bulkCreateStaffs);
router.delete('/bulk', authorize('Admin'), bulkDeleteStaffs);

router.route('/:id')
    .get(getStaffById) // REMOVED authorization
    .put(authorize('Admin'), upload.single('profileImage'), updateStaff)
    .delete(authorize('Admin'), deleteStaff);

module.exports = router;