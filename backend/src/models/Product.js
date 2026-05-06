const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    ms: { type: String, required: true },
    en: { type: String, required: true },
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    ms: { type: String },
    en: { type: String },
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['curtains', 'furniture'],
  },
  images: [String],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  variants: [
    {
      label: {
        ms: { type: String },
        en: { type: String },
      },
      priceModifier: { type: Number, default: 0 },
      stock: { type: Number, default: 0 },
    }
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
