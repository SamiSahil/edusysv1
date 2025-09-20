// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getUsers, createUser, getUserById,
    updateUser, deleteUser, bulkCreateUsers, bulkDeleteUsers
} = require('../controllers/userController');

router.use(protect);

router.route('/')
    .get(getUsers) // REMOVED authorization
    .post(authorize('Admin'), createUser);

router.post('/bulk', authorize('Admin'), bulkCreateUsers);
router.delete('/bulk', authorize('Admin'), bulkDeleteUsers);

router.route('/:id')
    .get(getUserById) // REMOVED authorization
    .put(authorize('Admin'), updateUser)
    .delete(authorize('Admin'), deleteUser);

module.exports = router;