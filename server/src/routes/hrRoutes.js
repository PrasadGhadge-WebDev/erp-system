const express = require('express');
const router = express.Router();
const {
  getDepartments,
  createDepartment,
  getEmployees,
  createEmployee,
  getAttendance,
  markAttendance,
  getLeaveRequests,
  createLeaveRequest,
} = require('../controllers/hrController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/departments').get(protect, getDepartments).post(protect, createDepartment);
router.route('/employees').get(protect, getEmployees).post(protect, createEmployee);
router.route('/attendance').get(protect, getAttendance).post(protect, markAttendance);
router.route('/leaves').get(protect, getLeaveRequests).post(protect, createLeaveRequest);

module.exports = router;
