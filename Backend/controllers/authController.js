// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model.js');
const Student = require('../models/student.model.js');
const Teacher = require('../models/teacher.model.js');
const jwt = require('jsonwebtoken');

// Helper function to sign a new JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token will be valid for 1 day
    });
};

const loginUser = asyncHandler(async (req, res) => {
    const { username, password, portal } = req.body;
    const email = username;

    if (!email || !password || !portal) {
        res.status(400);
        throw new Error('Please provide email, password, and portal.');
    }

    const portalToRoleMap = {
        'Administration': 'Admin',
        'Teacher': 'Teacher',
        'Student': 'Student',
        'Accountant': 'Accountant',
        'Librarian': 'Librarian'
    };
    const expectedRole = portalToRoleMap[portal];
    if (!expectedRole) {
        res.status(400).json({ success: false, message: 'Invalid portal specified.' });
        return;
    }

    const user = await User.findOne({ email });

    // In a real app, you would use bcrypt.compare(password, user.password)
    if (user && user.password === password) {
        if (user.role === expectedRole) {
            let fullUserDetails = { ...user.toObject() };

                  if (user.role === 'Student' && user.studentId) {
                // --- THIS IS THE FIX ---
                // We now deeply populate the student's section, subject, and department details on login.
                const studentProfile = await Student.findById(user.studentId).populate({
                    path: 'sectionId',
                    populate: {
                        path: 'subjectId',
                        populate: {
                            path: 'departmentId',
                            select: 'name' // Only select the name field
                        }
                    }
                });
                // --- END OF FIX ---
                if (studentProfile) fullUserDetails = { ...studentProfile.toObject(), ...fullUserDetails };
            } else if (user.role === 'Teacher' && user.teacherId) {
                const teacherProfile = await Teacher.findById(user.teacherId);
                if (teacherProfile) fullUserDetails = { ...teacherProfile.toObject(), ...fullUserDetails };
            }


            fullUserDetails.id = fullUserDetails._id.toString();

            // Send back user data AND the newly generated token
            res.json({
                success: true,
                user: fullUserDetails,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({
                success: false,
                message: `Invalid credentials for this portal. Please use the correct portal for your role.`
            });
        }
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
});

module.exports = {
    loginUser,
};