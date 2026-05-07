'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { CONFIG } from '@/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const setUser = useAuthStore((state) => state.setUser);
  const t = useTranslations('Login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${CONFIG.API_URL}/auth/login`, {
        email,
        password,
      });
      setUser(data);
      router.push(`/${locale}`);
    } catch (err: any) {
      setError(err.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left: Image Side (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-fancy-charcoal overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <img 
              src="/logo1.jpeg" 
              alt="Fancy Logo" 
              className="h-32 w-auto object-contain mb-8 filter drop-shadow-2xl"
            />
            <div className="w-16 h-1 bg-fancy-maroon mb-8"></div>
            <p className="text-white/80 text-sm tracking-[0.3em] uppercase font-bold max-w-sm leading-loose">
              {t('tagline')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-[#fcfcf9] relative">
        <Link 
          href={`/${locale}`}
          className="absolute top-8 left-6 sm:left-12 lg:left-24 text-[10px] tracking-[0.2em] font-extrabold uppercase text-gray-400 hover:text-fancy-maroon transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          {t('back')}
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex justify-center mb-12">
            <img 
              src="/logo1.jpeg" 
              alt="Fancy Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-fancy-charcoal tracking-tight mb-3">
              {t('welcome')}
            </h2>
            <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">
              {t('subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded-sm shadow-sm"
                >
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm font-bold text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm outline-none transition-all text-sm font-medium shadow-sm"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
                  {t('password')}
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm outline-none transition-all text-sm font-medium shadow-sm"
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fancy-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fancy-charcoal text-white py-5 text-xs tracking-[0.4em] uppercase font-extrabold hover:bg-fancy-maroon transition-all shadow-xl rounded-sm disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    {t('signingIn')}
                  </span>
                ) : (
                  t('signIn')
                )}
              </button>
            </div>
          </form>

          {/* Secure Login Note */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <Lock size={12} /> {t('secureAccess')}
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
