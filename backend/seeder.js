const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  // CURTAINS
  {
    name: { ms: 'Langsir Velvet Diraja', en: 'Royal Velvet Curtains' },
    slug: 'royal-velvet-curtains',
    description: {
      ms: 'Langsir velvet tebal dengan tekstur mewah, memberikan privasi penuh dan rupa elegan.',
      en: 'Heavy velvet curtains with a luxurious texture, providing full privacy and an elegant look.'
    },
    price: 280.00,
    category: 'curtains',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop'],
    stock: 50,
    isFeatured: true
  },
  {
    name: { ms: 'Langsir Sheer Minimalis', en: 'Minimalist Sheer Curtains' },
    slug: 'minimalist-sheer-curtains',
    description: {
      ms: 'Langsir nipis yang membenarkan cahaya lembut masuk sambil mengekalkan privasi.',
      en: 'Light sheer curtains that allow soft light to enter while maintaining privacy.'
    },
    price: 120.00,
    category: 'curtains',
    images: ['https://images.unsplash.com/photo-1616489953149-8e7714652250?q=80&w=2070&auto=format&fit=crop'],
    stock: 100,
    isFeatured: true
  },
  {
    name: { ms: 'Langsir Blackout Emerald', en: 'Emerald Blackout Curtains' },
    slug: 'emerald-blackout-curtains',
    description: {
      ms: 'Menghalang 99% cahaya matahari, sesuai untuk tidur yang nyenyak.',
      en: 'Blocks 99% of sunlight, perfect for a deep restful sleep.'
    },
    price: 350.00,
    category: 'curtains',
    images: ['https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?q=80&w=2070&auto=format&fit=crop'],
    stock: 30,
    isFeatured: true
  },
  {
    name: { ms: 'Langsir Linen Moden', en: 'Modern Linen Curtains' },
    slug: 'modern-linen-curtains',
    description: {
      ms: 'Tekstur linen semulajadi untuk suasana rumah yang santai dan organik.',
      en: 'Natural linen texture for a relaxed and organic home atmosphere.'
    },
    price: 190.00,
    category: 'curtains',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop'],
    stock: 60,
    isFeatured: true
  },
  // FURNITURE
  {
    name: { ms: 'Sofa Nordic Kelabu', en: 'Grey Nordic Sofa' },
    slug: 'grey-nordic-sofa',
    description: {
      ms: 'Sofa 3-tempat duduk dengan reka bentuk Scandinavia yang minimalis.',
      en: '3-seater sofa with a minimalist Scandinavian design.'
    },
    price: 1450.00,
    category: 'furniture',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'],
    stock: 10,
    isFeatured: true
  },
  {
    name: { ms: 'Kerusi Lengan Velvet', en: 'Velvet Armchair' },
    slug: 'velvet-armchair',
    description: {
      ms: 'Kerusi lengan yang selesa dengan kemasan velvet maroon.',
      en: 'Comfortable armchair with a maroon velvet finish.'
    },
    price: 890.00,
    category: 'furniture',
    images: ['https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1974&auto=format&fit=crop'],
    stock: 15,
    isFeatured: true
  },
  {
    name: { ms: 'Meja Kopi Marmar', en: 'Marble Coffee Table' },
    slug: 'marble-coffee-table',
    description: {
      ms: 'Meja kopi elegan dengan permukaan marmar putih asli.',
      en: 'Elegant coffee table with a genuine white marble surface.'
    },
    price: 550.00,
    category: 'furniture',
    images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop'],
    stock: 20,
    isFeatured: true
  },
  {
    name: { ms: 'Katil Premium Minimalis', en: 'Minimalist Premium Bed' },
    slug: 'minimalist-premium-bed',
    description: {
      ms: 'Bingkai katil kayu berkualiti tinggi dengan gaya kontemporari.',
      en: 'High-quality wooden bed frame with a contemporary style.'
    },
    price: 2200.00,
    category: 'furniture',
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop'],
    stock: 5,
    isFeatured: true
  }
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error with seeding data', error);
    process.exit(1);
  }
};

seedData();
