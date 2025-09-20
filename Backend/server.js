// Backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
// Load environment variables
dotenv.config();
// Connect to the database
connectDB();
const app = express();
// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '50mb' })); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // To parse URL-encoded bodies
app.get('/', (req, res) => {
    res.status(200).json({ message: 'EduSys Pro API is online and running.Thanks For visiting......' });
});
// --- API ROUTES ---
// All API routes are now prefixed with /api to distinguish them from frontend pages.
app.use('/api', require('./routes/auth.routes')); 
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/staffs', require('./routes/staff.routes')); 
app.use('/api/subjects', require('./routes/subject.routes'));
app.use('/api/sections', require('./routes/section.routes')); 
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/timetable', require('./routes/timetable.routes'));
app.use('/api/notices', require('./routes/notice.routes'));
app.use('/api/financial', require('./routes/financial.routes'));
app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/results', require('./routes/result.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/library', require('./routes/library.routes'));
app.use('/api/transport', require('./routes/transport.routes'));


// --- Error Handling Middleware (Unchanged) ---
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4051;

app.listen(PORT, () =>
  console.log(`Server is running successfully on http://localhost:${PORT}`)
);