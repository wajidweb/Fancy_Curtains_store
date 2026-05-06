const ServiceRequest = require('../models/ServiceRequest');

// @desc    Create new service request
// @route   POST /api/services
// @access  Public
const createServiceRequest = async (req, res) => {
  const { name, phone, email, address, preferredDate, notes } = req.body;

  try {
    const serviceRequest = new ServiceRequest({
      user: req.user ? req.user._id : null,
      name,
      phone,
      email,
      address,
      preferredDate,
      notes,
    });

    const createdRequest = await serviceRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all service requests
// @route   GET /api/services
// @access  Private/Admin
const getServiceRequests = async (req, res) => {
  const requests = await ServiceRequest.find({}).sort({ createdAt: -1 });
  res.json(requests);
};

// @desc    Update service request status
// @route   PUT /api/services/:id/status
// @access  Private/Admin
const updateServiceStatus = async (req, res) => {
  const request = await ServiceRequest.findById(req.params.id);

  if (request) {
    request.status = req.body.status || request.status;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } else {
    res.status(404).json({ message: 'Request not found' });
  }
};

module.exports = {
  createServiceRequest,
  getServiceRequests,
  updateServiceStatus,
};
