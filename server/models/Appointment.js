const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters long'],
    },
    service: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Appointment date and time is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
      required: [true, 'Status is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for search & filtering
appointmentSchema.index({ customerName: 'text' });

module.exports = mongoose.model('Appointment', appointmentSchema);

