'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    _id: string;
    name: { ms: string; en: string };
    price: number;
    images: string[];
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as 'ms' | 'en';
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity: 1,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link href={`/${locale}/products/${product._id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5] mb-6 rounded-sm shadow-sm">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name[locale]}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {/* OVERLAY ACTION */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full bg-white/95 backdrop-blur-md text-fancy-charcoal py-4 text-[10px] tracking-[0.3em] uppercase font-black hover:bg-fancy-maroon hover:text-white transition-all shadow-2xl rounded-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} strokeWidth={2.5} />
              Add to Cart
            </motion.button>
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <p className="text-[10px] tracking-[0.4em] uppercase text-fancy-maroon font-black mb-1 opacity-90">
            {product.category}
          </p>
          <h3 className="text-[14px] md:text-sm tracking-widest uppercase text-fancy-charcoal truncate font-bold group-hover:text-fancy-maroon transition-colors">
            {product.name[locale]}
          </h3>
          <p className="text-[15px] font-black text-fancy-charcoal tracking-tight">
            RM {product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
