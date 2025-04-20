const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Get all leaves
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    const leaves = await Leave.find(query)
      .sort({ startDate: -1, employeeName: 1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific leave
router.get('/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new leave request
router.post('/', async (req, res) => {
  try {
    const leave = new Leave({
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      approvedDate: req.body.approvedDate ? new Date(req.body.approvedDate) : undefined
    });
    
    const newLeave = await leave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    console.error('Error creating leave:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a leave request
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      approvedDate: req.body.approvedDate ? new Date(req.body.approvedDate) : undefined
    };

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    res.json(leave);
  } catch (error) {
    console.error('Error updating leave:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a leave request
router.delete('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    res.json({ message: 'Leave request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 