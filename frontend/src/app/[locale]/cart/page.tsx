'use client';

import { useCartStore } from '@/store/useCartStore';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/shared/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const locale = useLocale() as 'ms' | 'en';
  const t = useTranslations('Cart');

  if (items.length === 0) {
    return (
      <div className="bg-[#fcfcf9] min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-32 md:py-48">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-fancy-charcoal mb-6 tracking-tight">
              {t('empty')}
            </h1>
            <Link 
              href={`/${locale}/products`}
              className="inline-flex items-center gap-3 bg-fancy-maroon text-white px-10 py-5 text-xs tracking-[0.3em] uppercase font-bold hover:bg-fancy-charcoal transition-all shadow-xl"
            >
              {t('startShopping')}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcf9] min-h-screen pt-32 md:pt-48">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-fancy-charcoal tracking-tighter mb-4 uppercase">
              {t('title')}
            </h1>
            <p className="text-gray-400 font-bold text-xs tracking-[0.2em] uppercase">
              {t('itemsCount', { count: items.length })}
            </p>
          </div>
          <Link 
            href={`/${locale}/products`}
            className="text-[11px] tracking-[0.2em] font-extrabold uppercase text-fancy-maroon hover:text-fancy-charcoal flex items-center gap-2 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t('back')}
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* 1. CART ITEMS LIST */}
          <div className="lg:col-span-8">
            <div className="border-t border-gray-100">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={`${item.id}-${item.selectedVariant}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center py-8 border-b border-gray-100 gap-6 group"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-32 aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name[locale]} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-fancy-charcoal uppercase tracking-tight group-hover:text-fancy-maroon transition-colors">
                        {item.name[locale]}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">
                          {item.selectedVariant}
                        </p>
                      )}
                      
                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex items-center bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-extrabold text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-400"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          title={t('remove')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-full sm:w-auto text-left sm:text-right pt-4 sm:pt-0">
                      <p className="text-xl font-extrabold text-fancy-charcoal">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        RM {item.price.toFixed(2)} / {t('item')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-fancy-maroon" />
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] leading-tight text-gray-400">Authentic<br/>Quality</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center flex-shrink-0">
                  <Truck size={18} className="text-fancy-maroon" />
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] leading-tight text-gray-400">Secure<br/>Delivery</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center flex-shrink-0">
                  <RefreshCcw size={18} className="text-fancy-maroon" />
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] leading-tight text-gray-400">Easy<br/>Returns</span>
              </div>
            </div>
          </div>

          {/* 2. ORDER SUMMARY SECTION */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm shadow-xl sticky top-32">
              <h2 className="text-xl font-extrabold text-fancy-charcoal mb-10 tracking-tight uppercase border-b border-gray-50 pb-6">
                {t('summary')}
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 uppercase tracking-widest text-[11px]">{t('subtotal')}</span>
                  <span className="font-extrabold text-fancy-charcoal">RM {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 uppercase tracking-widest text-[11px]">{t('shipping')}</span>
                  <span className="text-green-600 font-extrabold uppercase tracking-widest text-[11px]">{t('shippingFree')}</span>
                </div>
                <div className="h-[1px] bg-gray-50 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-fancy-charcoal uppercase tracking-widest text-[13px]">{t('total')}</span>
                  <span className="text-2xl font-black text-fancy-maroon">RM {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Link 
                href={`/${locale}/checkout`}
                className="w-full bg-fancy-charcoal text-white py-6 text-[11px] tracking-[0.4em] uppercase font-extrabold hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 rounded-sm"
              >
                {t('checkout')}
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              
              <div className="mt-8 pt-8 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose text-center">
                  {t('taxNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
