'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/product/ProductCard';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG } from '@/config';
import Footer from '@/components/shared/Footer';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  LayoutGrid, 
  Grid3X3,
  Filter
} from 'lucide-react';

export default function ProductsPage() {
  const t = useTranslations('Products');
  const locale = useLocale() as 'ms' | 'en';
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync category filter with URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${CONFIG.API_URL}/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p: any) => p.category === selectedCategory);
    }

    // Search
    if (searchQuery) {
      result = result.filter((p: any) => 
        p.name[locale].toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'priceLow') {
      result.sort((a: any, b: any) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      result.sort((a: any, b: any) => b.price - a.price);
    } else {
      result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, locale]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fancy-maroon"></div>
    </div>
  );

  return (
    <div className="bg-[#fcfcf9] min-h-screen font-sans text-fancy-charcoal">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Interior Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold text-white mb-4 mt-4 block"
          >
            {t('hero.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 uppercase"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-sm md:text-lg text-white/80 font-medium leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN PRODUCTS AREA */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-fancy-charcoal text-white px-6 py-3 text-[10px] tracking-widest uppercase font-bold rounded-sm shadow-lg"
            >
              <Filter size={14} /> {t('filters.title')}
            </button>
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={t('filters.search')}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm outline-none transition-all text-sm font-medium shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full lg:w-auto gap-8">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
              {filteredAndSortedProducts.length} Results
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">{t('filters.sortBy')}</span>
              <div className="relative group">
                <select 
                  className="appearance-none bg-white border border-gray-100 px-6 py-3 pr-10 text-[10px] font-bold tracking-widest uppercase rounded-sm outline-none cursor-pointer focus:border-fancy-maroon shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">{t('filters.newest')}</option>
                  <option value="priceLow">{t('filters.priceLow')}</option>
                  <option value="priceHigh">{t('filters.priceHigh')}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-extrabold tracking-[0.2em] uppercase mb-8 pb-4 border-b border-fancy-maroon w-fit">
                  {t('filters.categories')}
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'all', label: t('filters.all') },
                    { id: 'curtains', label: t('filters.curtains') },
                    { id: 'furniture', label: t('filters.furniture') }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between w-full group transition-all ${selectedCategory === cat.id ? 'text-fancy-maroon font-bold' : 'text-gray-500 hover:text-fancy-charcoal'}`}
                    >
                      <span className="text-xs tracking-widest uppercase transition-transform group-hover:translate-x-1">{cat.label}</span>
                      {selectedCategory === cat.id && <div className="w-1.5 h-1.5 bg-fancy-maroon rounded-full"></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner/CTA */}
              <div className="bg-fancy-charcoal p-8 rounded-sm text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fancy-maroon/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                <h4 className="text-xl font-bold mb-4 relative z-10 leading-tight">Need Custom Measurements?</h4>
                <p className="text-[10px] text-white/60 mb-6 uppercase tracking-widest relative z-10 leading-relaxed">Book a professional measurement session at your home for free.</p>
                <Link 
                  href={`/${locale}/services`}
                  className="inline-block text-[10px] font-black tracking-widest uppercase border-b border-white pb-2 hover:text-fancy-maroon hover:border-fancy-maroon transition-all relative z-10"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredAndSortedProducts.length > 0 ? (
                <motion.div 
                  key={`${selectedCategory}-${searchQuery}-${sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12"
                >
                  {filteredAndSortedProducts.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center"
                >
                  <SlidersHorizontal size={48} className="mx-auto text-gray-200 mb-6" />
                  <h3 className="text-xl font-bold text-gray-400 tracking-tight">{t('filters.noResults')}</h3>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="mt-6 text-[10px] font-bold uppercase tracking-widest text-fancy-maroon underline underline-offset-8"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER OVERLAY */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm lg:hidden"
            ></motion.div>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[160] shadow-2xl p-10 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-lg font-bold tracking-widest uppercase">{t('filters.title')}</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-12">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
                    {t('filters.categories')}
                  </h4>
                  <div className="flex flex-col gap-5">
                    {[
                      { id: 'all', label: t('filters.all') },
                      { id: 'curtains', label: t('filters.curtains') },
                      { id: 'furniture', label: t('filters.furniture') }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setIsFilterOpen(false); }}
                        className={`text-xs tracking-widest uppercase text-left transition-all ${selectedCategory === cat.id ? 'text-fancy-maroon font-bold border-l-4 border-fancy-maroon pl-4' : 'text-gray-500 pl-0'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-fancy-charcoal text-white py-5 text-[10px] tracking-[0.3em] uppercase font-bold rounded-sm mt-auto shadow-xl"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
