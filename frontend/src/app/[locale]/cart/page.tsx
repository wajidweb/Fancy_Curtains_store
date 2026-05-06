'use client';

import { useCartStore } from '@/store/useCartStore';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const locale = useLocale() as 'ms' | 'en';

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingBag size={80} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-emerald-900 mb-4">
          {locale === 'ms' ? 'Bakul anda kosong' : 'Your cart is empty'}
        </h1>
        <Link 
          href={`/${locale}/products`}
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
        >
          {locale === 'ms' ? 'Mula Membeli-belah' : 'Start Shopping'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-emerald-900 mb-8">
        {locale === 'ms' ? 'Bakul Membeli-belah' : 'Shopping Cart'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.selectedVariant}`} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src={item.image} alt={item.name[locale]} className="h-full w-full object-cover" />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3 className="font-bold text-emerald-900">{item.name[locale]}</h3>
                    <p className="ml-4">RM {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  {item.selectedVariant && (
                    <p className="mt-1 text-sm text-gray-500">{item.selectedVariant}</p>
                  )}
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-emerald-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-medium text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-emerald-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="font-medium text-red-600 hover:text-red-500 flex items-center"
                    >
                      <Trash2 size={18} className="mr-1" />
                      {locale === 'ms' ? 'Buang' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-emerald-50 p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-bold text-emerald-900 mb-6">
              {locale === 'ms' ? 'Ringkasan Pesanan' : 'Order Summary'}
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>RM {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{locale === 'ms' ? 'Penghantaran' : 'Shipping'}</span>
                <span className="text-green-600 font-medium">{locale === 'ms' ? 'Percuma' : 'Free'}</span>
              </div>
              <div className="border-t border-emerald-200 pt-4 flex justify-between text-xl font-bold text-emerald-900">
                <span>Total</span>
                <span>RM {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            <Link 
              href={`/${locale}/checkout`}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{locale === 'ms' ? 'Teruskan ke Bayaran' : 'Proceed to Checkout'}</span>
              <ArrowRight size={20} />
            </Link>
            <p className="mt-4 text-xs text-gray-500 text-center">
              {locale === 'ms' 
                ? 'Termasuk SST dan semua caj perkhidmatan.' 
                : 'Includes SST and all service charges.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
