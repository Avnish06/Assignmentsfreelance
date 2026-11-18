const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// GET /api/appointments
// Query params supported:
// status: 'All' | 'Pending' | 'Confirmed' | 'Cancelled'
// search: string (matches customerName case-insensitively)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim() !== '') {
      filter.customerName = { $regex: search.trim(), $options: 'i' };
    }

    const appointments = await Appointment.find(filter).sort({ dateTime: 1 });
    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
      error: error.message,
    });
  }
});

// POST /api/appointments
// Body: { customerName, service, dateTime, status }
router.post('/', async (req, res) => {
  try {
    const { customerName, service, dateTime, status } = req.body;

    // Field-level explicit validation
    const errors = {};
    if (!customerName || !customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }
    if (!service || !service.trim()) {
      errors.service = 'Service is required';
    }
    if (!dateTime) {
      errors.dateTime = 'Date and time is required';
    } else if (isNaN(new Date(dateTime).getTime())) {
      errors.dateTime = 'Invalid date and time format';
    }
    if (status && !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      errors.status = 'Status must be Pending, Confirmed, or Cancelled';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const appointment = new Appointment({
      customerName: customerName.trim(),
      service: service.trim(),
      dateTime: new Date(dateTime),
      status: status || 'Pending',
    });

    const saved = await appointment.save();
    res.status(201).json({
      success: true,
      data: saved,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating appointment',
      error: error.message,
    });
  }
});

// PATCH /api/appointments/:id/status
// Body: { status }
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'A valid status (Pending, Confirmed, Cancelled) is required',
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment status updated successfully',
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status',
      error: error.message,
    });
  }
});

// DELETE /api/appointments/:id (Optional cleanup helper)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    res.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting appointment',
      error: error.message,
    });
  }
});

module.exports = router;

