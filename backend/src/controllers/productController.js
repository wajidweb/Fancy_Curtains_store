const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { isActive: true };
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    const { name, description, price, category, stock, variants, slug, isFeatured, isActive, specifications, careInstructions } = data;

    let images = data.images || [];
    
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...uploadedImages];
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      images,
      stock: Number(stock),
      variants,
      slug,
      isFeatured,
      isActive,
      specifications,
      careInstructions
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    const { name, description, price, category, stock, variants, isActive, isFeatured, specifications, careInstructions } = data;

    let images = data.images || [];

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...uploadedImages];
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.category = category || product.category;
      product.images = images.length > 0 ? images : product.images;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.variants = variants || product.variants;
      product.isActive = isActive !== undefined ? isActive : product.isActive;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.specifications = specifications || product.specifications;
      product.careInstructions = careInstructions || product.careInstructions;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
