'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/product/ProductCard';
import axios from 'axios';

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

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-emerald-900 mb-8">{t('products')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
