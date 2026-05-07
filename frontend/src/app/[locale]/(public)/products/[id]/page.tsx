'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { 
  ShoppingCart, 
  Check, 
  Minus, 
  Plus, 
  Heart, 
  Ruler,
  Star,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '@/store/useCartStore';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LatestProducts from '@/components/shared/LatestProducts';
import Footer from '@/components/shared/Footer';
import { CONFIG } from '@/config';

interface Product {
  _id: string;
  name: { ms: string; en: string };
  description: { ms: string; en: string };
  price: number;
  category: 'curtains' | 'furniture';
  images: string[];
  stock: number;
  variants: Array<{
    label: { ms: string; en: string };
    priceModifier: number;
    stock: number;
  }>;
  specifications?: {
    material?: { ms: string; en: string };
    weight?: { ms: string; en: string };
    origin?: { ms: string; en: string };
    opacity?: { ms: string; en: string };
  };
  careInstructions?: { ms: string; en: string };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const locale = useLocale() as 'ms' | 'en';
  const t = useTranslations('ProductDetail');
  const tNav = useTranslations('Navigation');
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${CONFIG.API_URL}/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = product.price + (product.variants[selectedVariant]?.priceModifier || 0);
    const cartImage = product.images[0] 
      ? (product.images[0].startsWith('http') ? product.images[0] : `${CONFIG.API_URL.replace('/api', '')}${product.images[0]}`)
      : '/placeholder.jpg';
      
    addItem({
      id: product._id,
      name: product.name,
      price: finalPrice,
      image: cartImage,
      quantity: quantity,
      selectedVariant: product.variants[selectedVariant]?.label[locale],
    });
    router.push(`/${locale}/cart`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fancy-maroon"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcf9]">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <Link href={`/${locale}/products`} className="text-fancy-maroon font-bold underline">
        {t('back')}
      </Link>
    </div>
  );

  const currentPrice = product.price + (product.variants[selectedVariant]?.priceModifier || 0);

  return (
    <div className="bg-white min-h-screen font-sans text-fancy-charcoal pt-32 md:pt-48">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-12">
          <Link href={`/${locale}`} className="hover:text-fancy-maroon transition-colors">{tNav('home')}</Link>
          <ChevronRight size={10} className="text-gray-300" />
          <Link href={`/${locale}/products`} className="hover:text-fancy-maroon transition-colors">{tNav('products')}</Link>
          <ChevronRight size={10} className="text-gray-300" />
          <span className="text-fancy-charcoal truncate">{product.name[locale]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* 1. IMAGE GALLERY SECTION */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:h-[600px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-20 md:w-24 aspect-[4/5] rounded-sm overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-fancy-maroon shadow-md' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img.startsWith('http') ? img : `${CONFIG.API_URL.replace('/api', '')}${img}`} alt={`${product.name[locale]} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Viewer */}
            <div className="flex-1 relative aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]?.startsWith('http') ? product.images[activeImage] : `${CONFIG.API_URL.replace('/api', '')}${product.images[activeImage]}`}
                  alt={product.name[locale]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Badges */}
              <div className="absolute top-6 left-6">
                {product.stock > 0 ? (
                  <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-gray-800">{t('inStock')}</span>
                  </div>
                ) : (
                  <div className="bg-red-50/95 backdrop-blur-md px-4 py-2 rounded-full border border-red-100 shadow-sm">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-red-600">{t('outOfStock')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. PRODUCT INFO SECTION */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-fancy-maroon text-fancy-maroon" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">(12 {t('reviews')})</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-fancy-charcoal tracking-tight mb-4 uppercase">
                {product.name[locale]}
              </h1>
              <p className="text-[12px] tracking-[0.4em] uppercase font-bold text-fancy-maroon mb-6">
                {product.category} {t('collection')}
              </p>
              
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-extrabold text-fancy-charcoal">
                  RM {currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full mb-10"></div>

            {/* Selection Area */}
            <div className="space-y-10 mb-12">
              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] tracking-[0.2em] uppercase font-bold text-gray-500">{t('selectVariant')}</h3>
                    <button className="text-[10px] text-gray-400 font-bold uppercase underline hover:text-fancy-maroon">{t('sizeGuide')}</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(i)}
                        className={`min-w-[100px] px-6 py-4 text-[11px] tracking-widest font-bold uppercase transition-all border rounded-sm ${selectedVariant === i ? 'bg-fancy-charcoal text-white border-fancy-charcoal shadow-xl' : 'bg-white text-gray-400 border-gray-200 hover:border-fancy-maroon'}`}
                      >
                        {v.label[locale]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="text-[11px] tracking-[0.2em] uppercase font-bold text-gray-500">{t('quantity')}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-sm overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-extrabold text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-14 h-14 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Only {product.stock} {t('leftInStock')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-fancy-maroon text-white py-6 px-8 text-[11px] tracking-[0.4em] uppercase font-extrabold hover:bg-fancy-charcoal transition-all shadow-2xl flex items-center justify-center gap-4 rounded-sm"
                >
                  <ShoppingCart size={18} strokeWidth={2.5} />
                  {t('addToCart')}
                </button>
                <button className="w-20 border border-gray-200 flex items-center justify-center hover:bg-fancy-maroon hover:text-white hover:border-fancy-maroon transition-all group">
                  <Heart size={20} className="group-active:scale-90 transition-transform" />
                </button>
              </div>
              
              {product.category === 'curtains' && (
                <Link 
                  href={`/${locale}/services`}
                  className="w-full bg-fancy-charcoal text-white py-6 text-[11px] tracking-[0.4em] uppercase font-extrabold hover:bg-black transition-all flex items-center justify-center gap-4 rounded-sm"
                >
                  <Ruler size={18} strokeWidth={2.5} />
                  {t('bookMeasurement')}
                </Link>
              )}
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} className="text-fancy-maroon" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t('trust.guarantee').split(' ').map((w,i)=><span key={i}>{w}<br/></span>)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-fancy-maroon" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t('trust.shipping').split(' ').map((w,i)=><span key={i}>{w}<br/></span>)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={20} className="text-fancy-maroon" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t('trust.returns').split(' ').map((w,i)=><span key={i}>{w}<br/></span>)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DETAILED INFORMATION SECTION */}
        <div className="mt-32">
          <div className="flex justify-start md:justify-center border-b border-gray-100 mb-10 md:mb-16 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-8 md:gap-12 min-w-max px-2 md:px-0">
              {[
                { id: 'description', label: t('description') },
                { id: 'specifications', label: t('specifications') },
                { id: 'care', label: t('careInstructions') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.4em] uppercase font-extrabold pb-6 md:pb-8 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-fancy-maroon text-fancy-maroon' : 'border-transparent text-gray-300 hover:text-fancy-charcoal'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="prose prose-lg max-w-none"
              >
                {activeTab === 'description' && (
                  <div className="text-gray-500 font-medium leading-[2.2] text-center italic">
                    {product.description[locale]}
                  </div>
                )}
                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 py-4 border-b border-gray-50 italic">
                      <span className="font-extrabold text-fancy-charcoal uppercase tracking-widest text-[11px]">{t('specs.material')}</span>
                      <span className="text-right text-gray-500">{product.specifications?.material?.[locale] || t('specs.materialVal')}</span>
                    </div>
                    <div className="grid grid-cols-2 py-4 border-b border-gray-50 italic">
                      <span className="font-extrabold text-fancy-charcoal uppercase tracking-widest text-[11px]">{t('specs.weight')}</span>
                      <span className="text-right text-gray-500">{product.specifications?.weight?.[locale] || 'Approx. 1.5kg / Unit'}</span>
                    </div>
                    <div className="grid grid-cols-2 py-4 border-b border-gray-50 italic">
                      <span className="font-extrabold text-fancy-charcoal uppercase tracking-widest text-[11px]">{t('specs.origin')}</span>
                      <span className="text-right text-gray-500">{product.specifications?.origin?.[locale] || t('specs.originVal')}</span>
                    </div>
                    {product.category === 'curtains' && (
                      <div className="grid grid-cols-2 py-4 border-b border-gray-50 italic">
                        <span className="font-extrabold text-fancy-charcoal uppercase tracking-widest text-[11px]">{t('specs.opacity')}</span>
                        <span className="text-right text-gray-500">{product.specifications?.opacity?.[locale] || t('specs.opacityVal')}</span>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'care' && (
                  <div className="text-gray-500 font-medium leading-[2.2] text-center italic">
                    {product.careInstructions?.[locale] || t('specs.careVal')}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      <LatestProducts />
      <Footer />
    </div>
  );
}
