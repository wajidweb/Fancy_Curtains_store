const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
  serviceType: {
    type: String,
    required: true,
    enum: ['Curtain Measurement', 'Furniture Consultation', 'Full Interior Design', 'Other'],
    default: 'Curtain Measurement',
  },
  preferredDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  adminNotes: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Contacted', 'Measurement Scheduled', 'Quotation Sent', 'Completed', 'Cancelled'],
  },
}, {
  timestamps: true,
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;
