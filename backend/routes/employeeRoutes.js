const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create employee with resume upload
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const employeeData = req.body;
    
    if (req.file) {
      employeeData.resume = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname
      };
    }

    const employee = new Employee(employeeData);
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update employee with resume upload
router.put('/:id', upload.single('resume'), async (req, res) => {
  try {
    const employeeData = req.body;
    
    if (req.file) {
      // Delete old resume if exists
      const oldEmployee = await Employee.findById(req.params.id);
      if (oldEmployee.resume && oldEmployee.resume.path) {
        fs.unlink(oldEmployee.resume.path, (err) => {
          if (err) console.error('Error deleting old resume:', err);
        });
      }

      employeeData.resume = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname
      };
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      employeeData,
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete resume file if exists
    if (employee.resume && employee.resume.path) {
      fs.unlink(employee.resume.path, (err) => {
        if (err) console.error('Error deleting resume:', err);
      });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download resume
router.get('/:id/resume', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee || !employee.resume || !employee.resume.path) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const filePath = path.resolve(employee.resume.path);
    const fileName = employee.resume.originalName;

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 