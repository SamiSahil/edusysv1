// routes/department.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDepartments, createDepartment, updateDepartment, deleteDepartment, bulkDeleteDepartments } = require('../controllers/departmentController');

// Protect all routes - User must be logged in
router.use(protect);

router.route('/')
    .get(getDepartments) // REMOVED authorization - All logged-in users can view
    .post(authorize('Admin'), createDepartment); // RETAINED authorization - Only Admin can create

router.delete('/bulk', authorize('Admin'), bulkDeleteDepartments);

router.route('/:id')
    .put(authorize('Admin'), updateDepartment)
    .delete(authorize('Admin'), deleteDepartment);

module.exports = router;