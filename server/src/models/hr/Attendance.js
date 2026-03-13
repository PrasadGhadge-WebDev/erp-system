const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  attendance_date: { type: Date, required: true },
  check_in_time: { type: Date },
  check_out_time: { type: Date },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day'],
    required: true,
  },
  notes: { type: String },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
