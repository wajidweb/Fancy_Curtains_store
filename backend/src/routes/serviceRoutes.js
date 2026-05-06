const express = require('express');
const {
  createServiceRequest,
  getServiceRequests,
  updateServiceStatus,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to optionally attach user to request if token is present
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, createServiceRequest)
  .get(protect, admin, getServiceRequests);

router.route('/:id/status').put(protect, admin, updateServiceStatus);

module.exports = router;
