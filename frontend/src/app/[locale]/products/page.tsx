'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/product/ProductCard';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const t = useTranslations('Navigation');
  const locale = useLocale() as 'ms' | 'en';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fancy-maroon"></div>
    </div>
  );

  return (
    <div className="bg-[#fcfcf9] min-h-screen pt-32 md:pt-40 pb-20">
      <div className="max-w-[1800px] mx-auto px-4 md:px-12">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-fancy-charcoal tracking-tight mb-4">
            {t('products')}
          </h1>
          <div className="w-20 h-1 bg-fancy-maroon"></div>
        </header>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
