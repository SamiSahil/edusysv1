// routes/financial.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getFees, createFee, updateFee, deleteFee, generateMonthlyFees, bulkDeleteFees } = require('../controllers/feeController');
const { getSalaries, createSalary, updateSalary, deleteSalary, processSalaries } = require('../controllers/salaryController');
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');

router.use(protect);

// --- Fee Routes ---
router.get('/fees', getFees); // REMOVED authorization
router.post('/fees', authorize('Admin', 'Accountant'), createFee);
router.post('/fees/generate', authorize('Admin', 'Accountant'), generateMonthlyFees);
router.delete('/fees/bulk', authorize('Admin', 'Accountant'), bulkDeleteFees);
router.put('/fees/:id', authorize('Admin', 'Accountant'), updateFee);
router.delete('/fees/:id', authorize('Admin', 'Accountant'), deleteFee);

// --- Salary & Expense Routes ---
router.route('/salaries')
    .get(getSalaries) // REMOVED authorization
    .post(authorize('Admin', 'Accountant'), createSalary);
router.post('/salaries/process', authorize('Admin', 'Accountant'), processSalaries);
router.route('/salaries/:id')
    .put(authorize('Admin', 'Accountant'), updateSalary)
    .delete(authorize('Admin', 'Accountant'), deleteSalary);

router.route('/expenses')
    .get(getExpenses) // REMOVED authorization
    .post(authorize('Admin', 'Accountant'), createExpense);
router.route('/expenses/:id')
    .put(authorize('Admin', 'Accountant'), updateExpense)
    .delete(authorize('Admin', 'Accountant'), deleteExpense);

module.exports = router;