const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
  },
}, {
  timestamps: true,
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;
