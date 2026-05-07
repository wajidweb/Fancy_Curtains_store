'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { CONFIG } from '@/config';
import { motion } from 'framer-motion';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

interface Order {
  _id: string;
  orderItems: any[];
  shippingDetails: any;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const locale = useLocale() as 'ms' | 'en';
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login?redirect=profile/orders`);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${CONFIG.API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, locale, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fancy-maroon"></div>
    </div>
  );

  return (
    <div className="bg-[#fcfcf9] min-h-screen pt-32 md:pt-48">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        
        <header className="mb-12">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-extrabold uppercase text-gray-400 hover:text-fancy-maroon transition-colors mb-8 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-fancy-charcoal tracking-tighter uppercase">
            My Orders
          </h1>
          <p className="text-gray-400 font-bold text-xs tracking-[0.2em] uppercase mt-4">
            Track and manage your purchases
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white p-16 rounded-sm shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-fancy-charcoal mb-4 uppercase tracking-tight">No orders yet</h3>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto">Start exploring our collections and place your first order today.</p>
            <Link 
              href={`/${locale}/products`}
              className="inline-block bg-fancy-charcoal text-white px-10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-fancy-maroon transition-all shadow-xl"
            >
              Shop Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50/50 px-6 md:px-10 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                      <p className="text-sm font-bold text-fancy-charcoal">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-sm font-bold text-fancy-maroon">RM {order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-bold text-fancy-charcoal uppercase tracking-tighter">#{order._id.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {order.isDelivered ? (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100">
                        <CheckCircle2 size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Delivered</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full border border-amber-100">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Processing</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 md:px-10 py-8">
                  <div className="flex flex-col gap-8">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="w-20 h-24 bg-gray-50 flex-shrink-0 rounded-sm overflow-hidden border border-gray-100">
                          <img src={item.image} alt={item.name[locale]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-extrabold text-fancy-charcoal uppercase tracking-tight mb-1">{item.name[locale]}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity} • {item.selectedVariant || 'Standard'}</p>
                          <p className="text-sm font-black text-fancy-charcoal mt-3">RM {item.price.toFixed(2)}</p>
                        </div>
                        <Link 
                          href={`/${locale}/products/${item.id || item._id}`}
                          className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-fancy-maroon hover:text-fancy-charcoal transition-colors"
                        >
                          View Product <ChevronRight size={12} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-6 md:px-10 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Payment Method: <span className="text-fancy-charcoal">{order.paymentMethod.toUpperCase()}</span>
                    </span>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-fancy-charcoal border-b border-fancy-charcoal pb-0.5 hover:text-fancy-maroon hover:border-fancy-maroon transition-all">
                    Help with order
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
