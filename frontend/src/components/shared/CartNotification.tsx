'use client';

import { useCartStore } from '@/store/useCartStore';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';

export default function CartNotification() {
  const { notification, clearNotification } = useCartStore();
  const locale = useLocale();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[200] w-[90%] max-w-md"
        >
          <div className="bg-fancy-charcoal text-white p-4 rounded-sm shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-fancy-maroon rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag size={18} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-0.5">
                  {locale === 'ms' ? 'Berjaya!' : 'Success!'}
                </p>
                <p className="text-[11px] text-gray-300 font-medium tracking-wide">
                  {locale === 'ms' ? 'Produk telah ditambah ke bakul.' : 'Product added to your cart successfully.'}
                </p>
              </div>
            </div>
            <button 
              onClick={clearNotification}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Check size={18} className="text-green-500" strokeWidth={3} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
