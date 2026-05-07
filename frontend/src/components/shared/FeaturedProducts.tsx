'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import axios from 'axios';
import { CONFIG } from '@/config';

interface Product {
  _id: string;
  name: { ms: string; en: string };
  price: number;
  images: string[];
  category: string;
  isNew?: boolean;
}

export default function FeaturedProducts() {
  const locale = useLocale() as 'ms' | 'en';
  const t = useTranslations('FeaturedProducts');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'curtains' | 'furniture'>('curtains');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${CONFIG.API_URL}/products`);
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const products = allProducts.filter(p => p.category === activeTab);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const cartImage = product.images[0] 
      ? (product.images[0].startsWith('http') ? product.images[0] : `${CONFIG.API_URL.replace('/api', '')}${product.images[0]}`)
      : '/placeholder.jpg';

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: cartImage,
      quantity: 1,
    });
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fancy-maroon mx-auto"></div>
    </div>
  );

  return (
    <section className="py-20 md:py-32 bg-[#fcfcf9] font-sans overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-10 text-fancy-charcoal text-center md:text-left">
          <div className="max-w-2xl">
            <h3 className="text-xs tracking-[0.4em] uppercase font-bold text-fancy-maroon mb-4">{t('badge')}</h3>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{t('title')}</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto md:mx-0">{t('subtitle')}</p>
          </div>
          
          {/* Tabs Container - Centered on mobile */}
          <div className="flex w-full md:w-auto justify-center">
            <div className="flex bg-gray-100/50 p-1.5 rounded-xl border border-gray-200/50 backdrop-blur-sm">
              <button 
                onClick={() => setActiveTab('curtains')}
                className={`px-6 md:px-8 py-3 text-[10px] md:text-xs tracking-[0.2em] font-extrabold uppercase rounded-lg transition-all duration-300 ${activeTab === 'curtains' ? 'bg-white text-fancy-maroon shadow-md border border-gray-100' : 'text-gray-400 hover:text-fancy-charcoal'}`}
              >
                {t('curtains')}
              </button>
              <button 
                onClick={() => setActiveTab('furniture')}
                className={`px-6 md:px-8 py-3 text-[10px] md:text-xs tracking-[0.2em] font-extrabold uppercase rounded-lg transition-all duration-300 ${activeTab === 'furniture' ? 'bg-white text-fancy-maroon shadow-md border border-gray-100' : 'text-gray-400 hover:text-fancy-charcoal'}`}
              >
                {t('furniture')}
              </button>
            </div>
          </div>
        </div>

        {/* Grid - 1 column on small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <AnimatePresence mode="wait">
            {products.map((product) => {
              const displayImage = product.images[0] 
                ? (product.images[0].startsWith('http') ? product.images[0] : `${CONFIG.API_URL.replace('/api', '')}${product.images[0]}`)
                : null;

              return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <Link href={`/${locale}/products/${product._id}`} className="flex flex-col flex-1">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={product.name[locale]}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Badges */}
                    {product.isNew && (
                      <span className="absolute top-4 left-4 bg-fancy-maroon text-white text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {t('new')}
                      </span>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          router.push(`/${locale}/products/${product._id}`);
                        }}
                        className="bg-white p-3 rounded-full text-fancy-charcoal hover:bg-fancy-maroon hover:text-white shadow-xl transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>

                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-white/95 backdrop-blur-md text-fancy-charcoal py-4 text-[10px] tracking-[0.25em] uppercase font-extrabold hover:bg-fancy-maroon hover:text-white transition-all shadow-2xl flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} strokeWidth={2.5} />
                        {t('addToCart')}
                      </button>
                    </div>
                  </div>

                  {/* Content - Now part of the Link */}
                  <div className="flex flex-col items-center md:items-start p-6 text-center md:text-left flex-1 bg-white">
                    <div className="flex flex-col justify-between items-center md:items-start w-full mb-2 gap-2">
                      <h3 className="text-[14px] md:text-sm tracking-[0.05em] uppercase font-bold text-fancy-charcoal group-hover:text-fancy-maroon transition-colors line-clamp-2">
                        {product.name[locale]}
                      </h3>
                      <p className="text-[15px] md:text-sm font-bold text-fancy-maroon whitespace-nowrap">
                        RM {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Footer Link */}
        <div className="mt-20 flex justify-center">
          <Link 
            href={`/${locale}/products`}
            className="group flex flex-col items-center gap-4"
          >
            <span className="text-xs tracking-[0.4em] uppercase font-extrabold text-fancy-charcoal hover:text-fancy-maroon transition-colors">{t('viewAll')}</span>
            <div className="w-12 h-[1px] bg-gray-200 group-hover:w-24 group-hover:bg-fancy-maroon transition-all duration-500"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
