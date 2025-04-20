const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
   firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  resume: {
    filename: String,
    path: String,
    originalName: String
  }
});

module.exports = mongoose.model('Employee', employeeSchema); 