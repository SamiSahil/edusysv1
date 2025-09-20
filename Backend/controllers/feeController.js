// controllers/feeController.js
const asyncHandler = require('express-async-handler');
const Fee = require('../models/fee.model.js');
const Student = require('../models/student.model.js');

const getFees = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    let query = {};

    // If the user is a Student, filter fees to only show their own.
    if (loggedInUser.role === 'Student' && loggedInUser.studentId) {
        query = { studentId: loggedInUser.studentId };
    } 
    // Admins and Accountants can see all fees, so no extra filter is needed.

    const fees = await Fee.find(query)
        .sort({ dueDate: -1 })
        .populate('studentId', 'name rollNo');
        
    res.json(fees);
});

// ... (rest of the functions: createFee, updateFee, etc. do not need changes as they are
// protected by the `authorize('Admin', 'Accountant')` middleware in the routes file.)

const createFee = asyncHandler(async (req, res) => {
    const { studentId, feeType, amount, dueDate, status } = req.body;
    if (!studentId || !feeType || !amount || !dueDate) {
        res.status(400);
        throw new Error('Missing required fields for fee record');
    }
    const fee = await Fee.create({ studentId, feeType, amount, dueDate, status: status || 'Unpaid' });
    res.status(201).json(fee);
});

const updateFee = asyncHandler(async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    if (fee) {
        fee.status = req.body.status || fee.status;
        fee.paidDate = req.body.paidDate || fee.paidDate;
        if (req.body.status === 'Paid' && !req.body.paidDate) {
            fee.paidDate = new Date();
        }
        fee.feeType = req.body.feeType || fee.feeType;
        fee.amount = req.body.amount || fee.amount;
        fee.dueDate = req.body.dueDate || fee.dueDate;

        const updatedFee = await fee.save();
        res.json(updatedFee);
    } else {
        res.status(404);
        throw new Error('Fee record not found');
    }
});

const deleteFee = asyncHandler(async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    if (fee) {
        await fee.deleteOne();
        res.json({ message: 'Fee record removed' });
    } else {
        res.status(404);
        throw new Error('Fee record not found');
    }
});

const generateMonthlyFees = asyncHandler(async (req, res) => {
    const { feeType, amount, dueDate } = req.body;
    const students = await Student.find({});
    
    let generatedCount = 0;
    const feePromises = [];

    for (const student of students) {
        const existingFee = await Fee.findOne({ studentId: student._id, feeType: feeType, dueDate: dueDate });
        if (!existingFee) {
            feePromises.push(Fee.create({
                studentId: student._id,
                feeType: feeType,
                amount: amount,
                dueDate: dueDate,
                status: 'Unpaid'
            }));
            generatedCount++;
        }
    }
    await Promise.all(feePromises);
    res.status(201).json({ message: `Successfully generated ${generatedCount} new monthly fee records.` });
});

const bulkDeleteFees = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400);
        throw new Error('An array of fee record IDs is required.');
    }

    const result = await Fee.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('No matching fee records found to delete.');
    }

    res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} fee records.`
    });
});

module.exports = {
    getFees,
    createFee,
    updateFee,
    deleteFee,
    generateMonthlyFees,
    bulkDeleteFees
};