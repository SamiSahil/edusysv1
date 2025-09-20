// routes/library.routes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getLibraryData,
    getAllBooks, createBook, updateBook, deleteBook,
    getAllTransactions, createTransaction, updateTransaction,
    getAllReservations, createReservation, updateReservation, deleteReservation,
    getAllAcquisitions, createAcquisition,
    getAllReadingLists, createReadingList, updateReadingList, deleteReadingList,
} = require('../controllers/libraryController');

router.use(protect);

// All roles can view library data
router.get('/', getLibraryData);
router.route('/books').get(getAllBooks);
router.route('/transactions').get(getAllTransactions);
router.route('/reservations').get(getAllReservations);
router.route('/acquisitions').get(getAllAcquisitions);
router.route('/readingLists').get(getAllReadingLists);

// Librarian/Admin only for modifications
router.post('/books', authorize('Admin', 'Librarian'), createBook);
router.route('/books/:id').put(authorize('Admin', 'Librarian'), updateBook).delete(authorize('Admin', 'Librarian'), deleteBook);

router.post('/transactions', authorize('Admin', 'Librarian'), createTransaction);
router.put('/transactions/:id', authorize('Admin', 'Librarian'), updateTransaction);

// Students/Teachers can create reservations
router.post('/reservations', authorize('Admin', 'Librarian', 'Teacher', 'Student'), createReservation);
router.route('/reservations/:id').put(authorize('Admin', 'Librarian'), updateReservation).delete(authorize('Admin', 'Librarian'), deleteReservation);

// Teachers can request acquisitions
router.post('/acquisitions', authorize('Admin', 'Librarian', 'Teacher'), createAcquisition);

// Teachers can manage reading lists
router.post('/readingLists', authorize('Admin', 'Librarian', 'Teacher'), createReadingList);
router.route('/readingLists/:id').put(authorize('Admin', 'Librarian', 'Teacher'), updateReadingList).delete(authorize('Admin', 'Librarian', 'Teacher'), deleteReadingList);

module.exports = router;