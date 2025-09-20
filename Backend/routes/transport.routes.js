// routes/transport.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getRoutes, createRoute, updateRoute, deleteRoute } = require('../controllers/transportController');

router.use(protect);

router.route('/')
    .get(getRoutes) // REMOVED authorization
    .post(authorize('Admin'), createRoute);

router.route('/:id')
    .put(authorize('Admin'), updateRoute)
    .delete(authorize('Admin'), deleteRoute);

module.exports = router;