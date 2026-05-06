'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ShoppingCart, Check, Info, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '@/store/useCartStore';
import { useRouter, useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const locale = useLocale() as 'ms' | 'en';
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].label[locale]);
        }
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, locale]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity: 1,
      selectedVariant: selectedVariant || undefined,
    });
    router.push(`/${locale}/cart`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => router.back()} className="flex items-center text-emerald-700 mb-8 hover:underline">
        <ArrowLeft size={20} className="mr-2" />
        {locale === 'ms' ? 'Kembali' : 'Back'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-2xl overflow-hidden h-[500px]">
          <img
            src={product.images[0]}
            alt={product.name[locale]}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            {product.name[locale]}
          </h1>
          <p className="text-emerald-600 font-medium mb-6 uppercase tracking-wide">
            {product.category}
          </p>
          
          <div className="text-4xl font-bold text-emerald-800 mb-8">
            RM {product.price.toFixed(2)}
          </div>

          <div className="prose prose-emerald mb-8">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Info className="mr-2" size={20} />
              {locale === 'ms' ? 'Penerangan' : 'Description'}
            </h3>
            <p className="text-gray-600">
              {product.description[locale]}
            </p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'ms' ? 'Pilihan' : 'Options'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v.label[locale])}
                    className={`px-4 py-2 border-2 rounded-full font-medium transition-all ${
                      selectedVariant === v.label[locale]
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-500 hover:border-emerald-200'
                    }`}
                  >
                    {v.label[locale]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-8 text-sm text-gray-500">
            <div className="flex items-center text-green-600 font-medium">
              <Check size={18} className="mr-1" />
              {locale === 'ms' ? 'Stok Tersedia' : 'In Stock'} ({product.stock})
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart />
            <span>{locale === 'ms' ? 'Tambah ke Bakul' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
