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
              className="w-full bg-white/95 backdrop-blur-md text-fancy-charcoal py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-fancy-maroon hover:text-white transition-all shadow-xl rounded-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <p className="text-[10px] tracking-[0.4em] uppercase text-fancy-maroon font-extrabold mb-2 opacity-90">
            {product.category}
          </p>
          <h3 className="text-[13px] tracking-widest uppercase text-fancy-charcoal mb-2 truncate font-bold group-hover:text-fancy-maroon transition-colors">
            {product.name[locale]}
          </h3>
          <p className="text-sm font-extrabold text-fancy-charcoal">
            RM {product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
}
