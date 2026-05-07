'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  ChevronRight,
  Info
} from 'lucide-react';
import { CONFIG } from '@/config';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const locale = useLocale() as 'ms' | 'en';
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('cod');
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Load saved details from localStorage on mount
  useEffect(() => {
    const savedDetails = localStorage.getItem('fancy-shipping-details');
    if (savedDetails) {
      try {
        const parsed = JSON.parse(savedDetails);
        setShippingDetails(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved shipping details");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDetails = { ...shippingDetails, [e.target.name]: e.target.value };
    setShippingDetails(newDetails);
    // Persist to local storage for future visits
    localStorage.setItem('fancy-shipping-details', JSON.stringify(newDetails));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${locale}/login?redirect=checkout`);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: items,
        shippingDetails,
        paymentMethod,
        totalPrice: getTotalPrice(),
      };

      // 1. Store in Database
      await axios.post(`${CONFIG.API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // 2. Clear Cart & Show Success
      setSuccess(true);
      clearCart();
      
      // If payment is stripe, normally redirect here
      // if (paymentMethod === 'stripe') { window.location.href = 'stripe_url'; }
      
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#fcfcf9] min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-32 md:py-48">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-white p-12 rounded-sm shadow-2xl border border-gray-100 text-center"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-fancy-charcoal mb-6 tracking-tight">
              {t('success')}
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed mb-10">
              {t('successDesc')}
            </p>
            <button 
              onClick={() => router.push(`/${locale}/products`)}
              className="w-full bg-fancy-maroon text-white py-5 text-xs tracking-[0.3em] uppercase font-bold hover:bg-fancy-charcoal transition-all shadow-xl rounded-sm"
            >
              {t('backToShop')}
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    router.push(`/${locale}/cart`);
    return null;
  }

  return (
    <div className="bg-[#fcfcf9] min-h-screen pt-32 md:pt-48">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        
        {/* Header */}
        <header className="mb-12">
          <Link 
            href={`/${locale}/cart`}
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-extrabold uppercase text-gray-400 hover:text-fancy-maroon transition-colors mb-8 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            {tCart('back')}
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-fancy-charcoal tracking-tighter uppercase">
            {t('title')}
          </h1>
        </header>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* 1. Contact Info */}
            <section className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-fancy-charcoal text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-xl font-extrabold text-fancy-charcoal tracking-tight uppercase">{t('contact')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.email')}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                    placeholder="example@mail.com"
                    value={shippingDetails.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.phone')}</label>
                  <input
                    name="phone"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                    placeholder="+60..."
                    value={shippingDetails.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* 2. Shipping Details */}
            <section className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-fancy-charcoal text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-extrabold text-fancy-charcoal tracking-tight uppercase">{t('shipping')}</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.fullName')}</label>
                  <input
                    name="fullName"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                    placeholder="Full legal name"
                    value={shippingDetails.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.address')}</label>
                  <input
                    name="address"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                    placeholder="House no, street name..."
                    value={shippingDetails.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.city')}</label>
                    <input
                      name="city"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                      value={shippingDetails.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.state')}</label>
                    <input
                      name="state"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                      value={shippingDetails.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{t('labels.postalCode')}</label>
                    <input
                      name="postalCode"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                      value={shippingDetails.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-fancy-charcoal text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="text-xl font-extrabold text-fancy-charcoal tracking-tight uppercase">{t('payment')}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 border transition-all text-left flex flex-col gap-4 group ${paymentMethod === 'cod' ? 'border-fancy-maroon bg-fancy-maroon/[0.02] shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'bg-fancy-maroon text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-black uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-fancy-maroon' : 'text-fancy-charcoal'}`}>
                      {t('labels.cod')}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('labels.codDesc')}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-6 border transition-all text-left flex flex-col gap-4 group ${paymentMethod === 'stripe' ? 'border-fancy-maroon bg-fancy-maroon/[0.02] shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'stripe' ? 'bg-fancy-maroon text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-black uppercase tracking-widest ${paymentMethod === 'stripe' ? 'text-fancy-maroon' : 'text-fancy-charcoal'}`}>
                      {t('labels.stripe')}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('labels.stripeDesc')}</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              
              <div className="bg-white p-8 md:p-10 rounded-sm shadow-2xl border border-gray-100">
                <h2 className="text-xl font-extrabold text-fancy-charcoal mb-10 tracking-tight uppercase border-b border-gray-50 pb-6">
                  {t('summary')}
                </h2>

                {/* Items Mini List */}
                <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedVariant}`} className="flex gap-4 group">
                      <div className="w-16 h-20 bg-gray-50 flex-shrink-0 rounded-sm overflow-hidden">
                        <img src={item.image} alt={item.name[locale]} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-extrabold text-fancy-charcoal uppercase tracking-tight line-clamp-1">{item.name[locale]}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity} • {item.selectedVariant}</p>
                        <p className="text-[12px] font-black text-fancy-maroon mt-2">RM {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-10 pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[11px]">{tCart('subtotal')}</span>
                    <span className="font-extrabold text-fancy-charcoal text-sm">RM {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[11px]">{tCart('shipping')}</span>
                    <span className="text-green-600 font-extrabold uppercase tracking-widest text-[11px]">{tCart('shippingFree')}</span>
                  </div>
                  <div className="h-[1px] bg-gray-50 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-fancy-charcoal uppercase tracking-widest text-[13px]">{tCart('total')}</span>
                    <span className="text-2xl font-black text-fancy-maroon">RM {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-fancy-charcoal text-white py-6 text-[11px] tracking-[0.4em] uppercase font-extrabold hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 rounded-sm disabled:opacity-50"
                >
                  {loading ? 'Processing...' : t('placeOrder')}
                  <ChevronRight size={18} />
                </button>

                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Lock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Buyer Protection Guaranteed</span>
                  </div>
                </div>
              </div>
              
              {/* Guarantee Box */}
              <div className="bg-fancy-maroon text-white p-8 rounded-sm shadow-xl flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">Important Notice</h4>
                  <p className="text-[11px] text-white/70 font-medium leading-relaxed uppercase tracking-wider">
                    For bespoke curtain orders, our consultants will contact you within 24 hours to confirm precise measurements before processing.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
      <Footer />
    </div>
  );
}
