'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';
import { Calendar, MapPin, Phone, User, MessageSquare, CheckCircle, ChevronDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { CONFIG } from '@/config';
import Footer from '@/components/shared/Footer';

function ServiceBookingForm() {
  const t = useTranslations('Services');
  const locale = useLocale() as 'en' | 'ms';
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkedProduct, setLinkedProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceType: 'Curtain Measurement',
    preferredDate: '',
    notes: ''
  });

  useEffect(() => {
    if (productId) {
      axios.get(`${CONFIG.API_URL}/products/${productId}`)
        .then(res => setLinkedProduct(res.data))
        .catch(err => console.error("Failed to load linked product", err));
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        product: productId || undefined
      };
      await axios.post(`${CONFIG.API_URL}/services`, payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div 
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-2xl mx-auto text-center py-20"
        >
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <CheckCircle size={48} className="text-green-500 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-fancy-charcoal mb-6 tracking-tight uppercase">
            {t('success.title')}
          </h1>
          <p className="text-lg text-gray-500 mb-12 font-medium max-w-lg mx-auto leading-relaxed">
            {t('success.message')}
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-fancy-charcoal text-white px-12 py-5 text-xs tracking-[0.4em] uppercase font-extrabold hover:bg-fancy-maroon transition-all rounded-sm shadow-xl"
          >
            {t('success.back')}
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Header */}
          <div className="text-center mb-16 md:mb-24">
            <h3 className="text-fancy-maroon text-[10px] md:text-xs tracking-[0.5em] uppercase font-extrabold mb-4">
              {t('hero.badge')}
            </h3>
            <h1 className="text-4xl md:text-6xl font-extrabold text-fancy-charcoal tracking-tight mb-6 uppercase">
              {t('hero.title')}
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Layout Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
            
            {/* Left Side: Why Choose Us (Overlapping Card) */}
            <div className="lg:col-span-5 bg-fancy-charcoal text-white p-10 md:p-16 rounded-sm shadow-2xl z-10 lg:translate-x-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold mb-12 tracking-tight uppercase relative z-10">
                {t('whyChooseUs.title')}
              </h2>
              <ul className="space-y-10 relative z-10">
                {[
                  t('whyChooseUs.point1'),
                  t('whyChooseUs.point2'),
                  t('whyChooseUs.point3')
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start group">
                    <div className="mr-6 mt-1 flex-shrink-0">
                      <CheckCircle className="text-fancy-maroon group-hover:scale-110 transition-transform" size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-gray-300 font-medium text-lg leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-16 lg:pl-28 rounded-sm shadow-xl border border-gray-100 relative">
              
              {linkedProduct && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-100 rounded-sm flex items-start gap-4">
                  <Info className="text-fancy-maroon flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-[10px] tracking-widest font-bold uppercase text-gray-500 mb-1">Linked Product</p>
                    <p className="text-sm font-bold text-fancy-charcoal">{linkedProduct.name[locale]}</p>
                    <p className="text-xs text-gray-500 mt-1">This product will be automatically referenced in your service request.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                      {t('form.name')}
                    </label>
                    <div className="relative group">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-fancy-maroon transition-colors" size={18} />
                      <input
                        name="name"
                        required
                        className="w-full pl-8 pr-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-fancy-maroon outline-none transition-all text-sm font-bold text-fancy-charcoal placeholder:font-medium"
                        placeholder={t('form.namePlaceholder')}
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                      {t('form.phone')}
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-fancy-maroon transition-colors" size={18} />
                      <input
                        name="phone"
                        required
                        className="w-full pl-8 pr-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-fancy-maroon outline-none transition-all text-sm font-bold text-fancy-charcoal placeholder:font-medium"
                        placeholder={t('form.phonePlaceholder')}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                    {t('form.address')}
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-0 top-3 text-gray-300 group-focus-within:text-fancy-maroon transition-colors" size={18} />
                    <textarea
                      name="address"
                      required
                      rows={2}
                      className="w-full pl-8 pr-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-fancy-maroon outline-none transition-all text-sm font-bold text-fancy-charcoal resize-none placeholder:font-medium"
                      placeholder={t('form.addressPlaceholder')}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                      {t('form.date')}
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-fancy-maroon transition-colors" size={18} />
                      <input
                        name="preferredDate"
                        type="date"
                        required
                        className="w-full pl-8 pr-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-fancy-maroon outline-none transition-all text-sm font-bold text-fancy-charcoal appearance-none uppercase"
                        value={formData.preferredDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                      {t('form.serviceType')}
                    </label>
                    <div className="relative group">
                      <select
                        name="serviceType"
                        required
                        className="w-full pl-0 pr-8 py-3 bg-transparent border-b-2 border-gray-100 focus:border-fancy-maroon outline-none transition-all text-sm font-bold text-fancy-charcoal appearance-none uppercase tracking-widest cursor-pointer"
                        value={formData.serviceType}
                        onChange={handleChange}
                      >
                        <option value="Curtain Measurement">Curtain Measurement</option>
                        <option value="Furniture Consultation">Furniture Consultation</option>
                        <option value="Full Interior Design">Full Interior Design</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                    {t('form.notes')}
                  </label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-0 top-3 text-gray-300 group-focus-within:text-fancy-maroon transition-colors" size={18} />
                    <textarea
                      name="notes"
                      rows={2}
                      className="w-full pl-8 pr-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-fancy-maroon outline-none transition-all text-sm font-bold text-fancy-charcoal resize-none placeholder:font-medium"
                      placeholder={t('form.notesPlaceholder')}
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-fancy-charcoal text-white py-6 mt-8 rounded-sm font-extrabold text-xs tracking-[0.4em] uppercase hover:bg-fancy-maroon transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                  {loading ? t('form.submitting') : t('form.submit')}
                </button>
              </form>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ServiceBookingPage() {
  return (
    <div className="bg-[#fcfcf9] min-h-screen font-sans flex flex-col">
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-4 md:px-12 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="text-center py-20 animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Form...</div>}>
          <ServiceBookingForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
