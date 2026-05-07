'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import ProductCard from '@/components/product/ProductCard';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function LatestProducts() {
  const locale = useLocale();
  const t = useTranslations('ProductDetail');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/products');
        // Sort by createdAt descending and take top 4
        const latest = data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        setProducts(latest);
      } catch (error) {
        console.error('Error fetching latest products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-20 md:py-32 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <header className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-fancy-charcoal tracking-tight uppercase">
            {t('relatedProducts')}
          </h2>
          <div className="w-12 h-1 bg-fancy-maroon mt-4"></div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
