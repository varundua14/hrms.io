const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single candidate
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create candidate with resume upload
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const candidateData = req.body;
    
    if (req.file) {
      candidateData.resume = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname
      };
    }

    const candidate = new Candidate(candidateData);
    const newCandidate = await candidate.save();
    res.status(201).json(newCandidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update candidate with resume upload
router.put('/:id', upload.single('resume'), async (req, res) => {
  try {
    const candidateData = req.body;
    
    if (req.file) {
      // Delete old resume if exists
      const oldCandidate = await Candidate.findById(req.params.id);
      if (oldCandidate.resume && oldCandidate.resume.path) {
        fs.unlink(oldCandidate.resume.path, (err) => {
          if (err) console.error('Error deleting old resume:', err);
        });
      }

      candidateData.resume = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname
      };
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      candidateData,
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Delete resume file if exists
    if (candidate.resume && candidate.resume.path) {
      fs.unlink(candidate.resume.path, (err) => {
        if (err) console.error('Error deleting resume:', err);
      });
    }

    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download resume
router.get('/:id/resume', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resume || !candidate.resume.path) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const filePath = path.resolve(candidate.resume.path);
    const fileName = candidate.resume.originalName;

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

// Move candidate to employee
router.post('/:id/move-to-employee', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Create new employee from candidate data
    const employee = new Employee({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      department: req.body.department,
      position: candidate.position,
      salary: req.body.salary,
      role: 'employee', // Default role
      status: 'active', // Default status for new employees
      resume: candidate.resume,
      joiningDate: req.body.joiningDate || new Date()
    });

    // Save the new employee
    const newEmployee = await employee.save();

    // Delete the candidate
    await Candidate.findByIdAndDelete(req.params.id);

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 
