const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      selectedVariant: { type: String },
      price: { type: Number, required: true },
    }
  ],
  shippingDetails: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'cod'],
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'paid', 'failed'],
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  stripeSessionId: {
    type: String,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
