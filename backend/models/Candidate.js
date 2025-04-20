const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'screening', 'interview', 'selected', 'rejected'],
    default: 'new'
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    default: 'Engineering'
  },
  expectedSalary: {
    type: Number,
    required: true,
    default: 0
  },
  applyDate: {
    type: Date,
    default: Date.now
  },
  resume: {
    filename: String,
    path: String,
    originalName: String
  },
  skills: [{
    type: String
  }],
  experience: {
    type: Number,
    required: true
  },
  notes: String
});

module.exports = mongoose.model('Candidate', candidateSchema); 