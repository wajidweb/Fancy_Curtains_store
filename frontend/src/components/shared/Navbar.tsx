'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LangSwitcher from './LangSwitcher';
import { ShoppingCart, User, Menu, X, Package } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const { user, isAdmin } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('products'), href: `/${locale}/products` },
    { name: t('services'), href: `/${locale}/services` },
  ];

  const showWhiteNavbar = isScrolled || isMobileMenuOpen || !isHomePage;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-fancy-maroon text-white text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] uppercase py-2 md:py-3 px-4 flex justify-center items-center font-bold text-center">
        <span>{t('announcement')}</span>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className={`transition-all duration-500 ${showWhiteNavbar ? 'bg-white shadow-sm py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 text-fancy-charcoal">
          <div className="flex justify-between items-center font-medium">
            
            {/* LEFT: Nav Links (Desktop) & Menu Toggle (Mobile) */}
            <div className="flex items-center md:gap-10 w-1/4 md:w-1/3 font-bold">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${showWhiteNavbar ? 'text-fancy-charcoal' : 'text-white'} md:hidden transition-colors p-1`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden md:flex gap-10 text-[12px] tracking-[0.25em] uppercase">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors hover:text-fancy-maroon ${showWhiteNavbar ? 'text-fancy-charcoal' : 'text-white'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* CENTER: Logo */}
            <div className="flex-shrink-0 flex items-center justify-center w-2/4 md:w-1/3">
              <Link href={`/${locale}`} className="flex items-center">
                <img 
                  src={showWhiteNavbar ? "/logo1.jpeg" : "/logo2.jpeg"} 
                  alt="Fancy Langsir & Perabot" 
                  className="h-10 md:h-16 w-auto object-contain transition-all duration-500"
                />
              </Link>
            </div>
            
            {/* RIGHT: Lang, Cart, Auth */}
            <div className="flex items-center justify-end gap-3 md:gap-8 w-1/4 md:w-1/3 font-bold">
              <div className={`hidden lg:block transition-colors ${showWhiteNavbar ? '' : '[&_button]:border-white/50 [&_button]:text-white [&_button:hover]:bg-white [&_button:hover]:text-fancy-charcoal'}`}>
                <LangSwitcher />
              </div>
              
              <Link href={`/${locale}/cart`} className="relative p-1">
                <div className="relative">
                  <ShoppingCart size={24} strokeWidth={2.5} className={`transition-colors hover:text-fancy-maroon ${showWhiteNavbar ? 'text-fancy-charcoal' : 'text-white'}`} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-fancy-maroon text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>

              <div className="hidden sm:flex items-center gap-3 md:gap-4">
                {user ? (
                  <>
                    {isAdmin() && (
                      <Link 
                        href={`/${locale}/admin/dashboard`} 
                        className={`text-[10px] sm:text-[11px] tracking-[0.2em] px-4 py-2 border rounded-sm transition-colors uppercase font-bold ${
                          showWhiteNavbar 
                            ? 'border-fancy-charcoal text-fancy-charcoal hover:bg-fancy-charcoal hover:text-white' 
                            : 'border-white text-white hover:bg-white hover:text-fancy-charcoal'
                        }`}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link href={`/${locale}/profile/orders`} className={`transition-colors hover:text-fancy-maroon p-1 ${showWhiteNavbar ? 'text-fancy-charcoal' : 'text-white'}`} title={t('orders')}>
                      <Package size={22} strokeWidth={2.5} />
                    </Link>
                  </>
                ) : (
                  <Link href={`/${locale}/login`} className={`transition-colors hover:text-fancy-maroon p-1 ${showWhiteNavbar ? 'text-fancy-charcoal' : 'text-white'}`}>
                    <User size={24} strokeWidth={2.5} />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-100 md:hidden overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 font-bold uppercase text-[13px] tracking-[0.2em] text-fancy-charcoal">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-fancy-maroon transition-colors flex justify-between items-center"
                >
                  {link.name}
                  <X size={14} className="opacity-0" /> {/* Spacer */}
                </Link>
              ))}
              
              {user && (
                <Link
                  href={`/${locale}/profile/orders`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-fancy-maroon transition-colors flex justify-between items-center"
                >
                  {t('orders')}
                  <Package size={18} />
                </Link>
              )}

              <div className="h-[1px] bg-gray-100 my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{t('language')}</span>
                <LangSwitcher />
              </div>
              {!user && (
                <Link 
                  href={`/${locale}/login`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-fancy-maroon text-white py-4 px-6 rounded-sm text-center tracking-[0.3em]"
                >
                  {t('login')}
                </Link>
              )}
              {user && isAdmin() && (
                <Link 
                  href={`/${locale}/admin/dashboard`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-fancy-charcoal text-white py-4 px-6 rounded-sm text-center tracking-[0.3em]"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
