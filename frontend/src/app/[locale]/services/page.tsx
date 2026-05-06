'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import axios from 'axios';
import { Calendar, MapPin, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';

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
      await axios.post('http://localhost:5001/api/services', formData);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-emerald-500" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">
          {locale === 'ms' ? 'Tempahan Berjaya!' : 'Booking Successful!'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {locale === 'ms' 
            ? 'Terima kasih. Kami akan menghubungi anda secepat mungkin untuk mengesahkan tarikh dan masa.' 
            : 'Thank you. We will contact you as soon as possible to confirm the date and time.'}
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700"
        >
          {locale === 'ms' ? 'Kembali' : 'Go Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">
          {locale === 'ms' ? 'Perkhidmatan Ukuran & Pemasangan' : 'Measurement & Installation Service'}
        </h1>
        <p className="text-lg text-gray-600">
          {locale === 'ms' 
            ? 'Dapatkan ukuran profesional untuk langsir impian anda secara percuma.' 
            : 'Get professional measurements for your dream curtains for free.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 bg-emerald-900 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-8">{locale === 'ms' ? 'Kenapa pilih kami?' : 'Why choose us?'}</h2>
          <ul className="space-y-6">
            <li className="flex items-start">
              <CheckCircle className="mr-3 text-emerald-400 shrink-0" />
              <span>{locale === 'ms' ? 'Ukuran tepat oleh pakar langsir kami.' : 'Precise measurements by our curtain experts.'}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-3 text-emerald-400 shrink-0" />
              <span>{locale === 'ms' ? 'Nasihat percuma tentang pilihan fabrik dan gaya.' : 'Free advice on fabric choices and styles.'}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-3 text-emerald-400 shrink-0" />
              <span>{locale === 'ms' ? 'Perkhidmatan pemasangan yang kemas dan pantas.' : 'Neat and fast installation service.'}</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="name"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={locale === 'ms' ? 'Nama Penuh' : 'Full Name'}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="phone"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={locale === 'ms' ? 'Nombor Telefon (WhatsApp)' : 'Phone Number (WhatsApp)'}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="address"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={locale === 'ms' ? 'Alamat Penuh' : 'Full Address'}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="preferredDate"
                type="date"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.preferredDate}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea
                name="notes"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]"
                placeholder={locale === 'ms' ? 'Nota Tambahan' : 'Additional Notes'}
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? '...' : (locale === 'ms' ? 'Tempah Sekarang' : 'Book Now')}
          </button>
        </form>
      </div>
    </div>
  );
}
