'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import axios from 'axios';
import { Calendar, MapPin, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONFIG } from '@/config';

export default function ServiceBookingPage() {
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${CONFIG.API_URL}/services`, formData);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fcfcf9] pt-40 pb-20 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto bg-white p-12 rounded-sm shadow-xl border border-gray-100"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-fancy-charcoal mb-6 tracking-tight">
            {locale === 'ms' ? 'Tempahan Berjaya!' : 'Booking Successful!'}
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            {locale === 'ms' 
              ? 'Terima kasih. Kami akan menghubungi anda secepat mungkin untuk mengesahkan tarikh dan masa.' 
              : 'Thank you. We will contact you as soon as possible to confirm the date and time.'}
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-fancy-maroon text-white px-12 py-4 text-xs tracking-[0.3em] uppercase font-bold hover:bg-fancy-charcoal transition-all"
          >
            {locale === 'ms' ? 'Kembali' : 'Go Back'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcf9] min-h-screen pt-32 md:pt-40 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-12">
        <header className="text-center mb-20">
          <h3 className="text-fancy-maroon text-xs tracking-[0.5em] uppercase font-extrabold mb-4">
            Exclusive Services
          </h3>
          <h1 className="text-4xl md:text-6xl font-bold text-fancy-charcoal tracking-tight mb-6">
            {locale === 'ms' ? 'Tempahan Ukuran & Pemasangan' : 'Measurement & Installation'}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            {locale === 'ms' 
              ? 'Dapatkan ukuran profesional untuk langsir impian anda secara percuma terus ke rumah anda.' 
              : 'Get professional measurements for your dream curtains for free, delivered right to your doorstep.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-100">
          <div className="lg:col-span-5 p-8 md:p-16 bg-fancy-charcoal text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-10 tracking-tight">{locale === 'ms' ? 'Kenapa pilih kami?' : 'Why choose us?'}</h2>
            <ul className="space-y-8">
              {[
                { 
                  ms: 'Ukuran tepat oleh pakar langsir kami.', 
                  en: 'Precise measurements by our curtain experts.' 
                },
                { 
                  ms: 'Nasihat percuma tentang pilihan fabrik dan gaya.', 
                  en: 'Free advice on fabric choices and styles.' 
                },
                { 
                  ms: 'Perkhidmatan pemasangan yang kemas dan pantas.', 
                  en: 'Neat and fast installation service.' 
                }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mr-4 mt-1 bg-fancy-maroon/20 p-1 rounded-full">
                    <CheckCircle className="text-fancy-maroon" size={20} />
                  </div>
                  <span className="text-gray-300 font-medium leading-relaxed">{item[locale as 'ms' | 'en']}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 md:p-16 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    name="name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    name="phone"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                    placeholder="Enter your WhatsApp number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Full Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                <textarea
                  name="address"
                  required
                  rows={2}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                  placeholder="Enter your full installation address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  name="preferredDate"
                  type="date"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                  value={formData.preferredDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Additional Notes</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-300" size={18} />
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-fancy-maroon focus:bg-white rounded-sm outline-none transition-all text-sm font-medium"
                  placeholder="Tell us about your requirements (optional)"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fancy-maroon text-white py-5 rounded-sm font-bold text-xs tracking-[0.4em] uppercase hover:bg-fancy-charcoal transition-all shadow-xl disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : (locale === 'ms' ? 'Hantar Tempahan' : 'Confirm Booking')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
