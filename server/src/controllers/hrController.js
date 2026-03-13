const Department = require('../models/hr/Department');
const Employee = require('../models/hr/Employee');
const Attendance = require('../models/hr/Attendance');
const LeaveRequest = require('../models/hr/LeaveRequest');

// @desc    Get all departments
// @route   GET /api/hr/departments
// @access  Private
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a department
// @route   POST /api/hr/departments
// @access  Private
const createDepartment = async (req, res, next) => {
  try {
    const { department_name, description } = req.body;
    const department = await Department.create({ department_name, description });
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees
// @route   GET /api/hr/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({}).populate('department_id', 'department_name');
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an employee
// @route   POST /api/hr/employees
// @access  Private
const createEmployee = async (req, res, next) => {
  try {
    const {
      department_id,
      employee_code,
      name,
      email,
      phone,
      address,
      position,
      salary,
      join_date,
    } = req.body;

    const employee = await Employee.create({
      department_id,
      employee_code,
      name,
      email,
      phone,
      address,
      position,
      salary,
      join_date,
    });
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark attendance
// @route   POST /api/hr/attendance
// @access  Private
const markAttendance = async (req, res, next) => {
  try {
    const { employee_id, attendance_date, status, check_in_time, check_out_time, notes } = req.body;
    const attendance = await Attendance.create({
      employee_id,
      attendance_date,
      status,
      check_in_time,
      check_out_time,
      notes,
    });
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Create leave request
// @route   POST /api/hr/leaves
// @access  Private
const createLeaveRequest = async (req, res, next) => {
  try {
    const { employee_id, leave_type, start_date, end_date, reason } = req.body;
    const leave = await LeaveRequest.create({
      employee_id,
      leave_type,
      start_date,
      end_date,
      reason,
    });
    res.status(201).json(leave);
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance
// @route   GET /api/hr/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const filter = req.query.employee_id ? { employee_id: req.query.employee_id } : {};
    const attendance = await Attendance.find(filter).populate('employee_id', 'name employee_code');
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave requests
// @route   GET /api/hr/leaves
// @access  Private
const getLeaveRequests = async (req, res, next) => {
  try {
    const filter = req.query.employee_id ? { employee_id: req.query.employee_id } : {};
    const leaves = await LeaveRequest.find(filter)
      .populate('employee_id', 'name employee_code')
      .populate('approved_by', 'name email');
    res.json(leaves);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  getEmployees,
  createEmployee,
  getAttendance,
  markAttendance,
  getLeaveRequests,
  createLeaveRequest,
};
