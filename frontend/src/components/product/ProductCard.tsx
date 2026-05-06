'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

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
    <div className="group relative">
      <Link href={`/${locale}/products/${product._id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5] mb-4">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name[locale]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {/* OVERLAY ACTION */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-white text-slate-900 py-3 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-slate-900 hover:text-white transition-all shadow-xl"
            >
              Add to Cart
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-800 font-bold mb-1 opacity-80">
            {product.category}
          </p>
          <h3 className="text-sm tracking-widest uppercase text-slate-900 mb-2 truncate px-2 font-medium">
            {product.name[locale]}
          </h3>
          <p className="text-sm font-bold text-slate-900">
            RM {product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
}
