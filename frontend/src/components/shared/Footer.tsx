'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Camera, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { CONFIG } from '@/config';

export default function Footer() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <footer className="bg-white text-fancy-charcoal pt-20 pb-12 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
        {/* Brand & Info */}
        <div className="flex flex-col">
          <Link href={`/${locale}`} className="flex flex-col mb-6">
            <img 
              src="/logo1.jpeg" 
              alt="Fancy Langsir & Perabot" 
              className="h-16 md:h-20 w-auto object-contain self-start"
            />
          </Link>
          <p className="text-sm font-medium leading-relaxed mb-8 text-gray-500 max-w-xs">
            {t('footer.brandTagline')}
          </p>
          <div className="flex gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-fancy-maroon hover:bg-fancy-maroon hover:text-white transition-all shadow-sm">
              <Camera size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-fancy-maroon hover:bg-fancy-maroon hover:text-white transition-all shadow-sm">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="lg:pl-8">
          <h4 className="text-[11px] tracking-[0.4em] uppercase font-bold text-fancy-charcoal mb-8 border-b border-fancy-maroon w-fit pb-1">{t('footer.navHeader')}</h4>
          <ul className="space-y-4 text-[11px] tracking-[0.2em] uppercase font-bold text-gray-500">
            <li><Link href={`/${locale}`} className="hover:text-fancy-maroon transition-colors">{t('footer.home')}</Link></li>
            <li><Link href={`/${locale}/products`} className="hover:text-fancy-maroon transition-colors">{t('footer.products')}</Link></li>
            <li><Link href={`/${locale}/services`} className="hover:text-fancy-maroon transition-colors">{t('footer.services')}</Link></li>
            <li><Link href={`/${locale}/cart`} className="hover:text-fancy-maroon transition-colors">{t('footer.cart')}</Link></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-[11px] tracking-[0.4em] uppercase font-bold text-fancy-charcoal mb-8 border-b border-fancy-maroon w-fit pb-1">{t('footer.contactHeader')}</h4>
          <ul className="space-y-6">
            <li>
              <a 
                href={`https://wa.me/${CONFIG.CONTACT.WHATSAPP_1}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col group"
              >
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{CONFIG.CONTACT.NAME_1}</span>
                <span className="text-sm font-bold text-fancy-charcoal group-hover:text-fancy-maroon transition-colors flex items-center gap-2">
                  00{CONFIG.CONTACT.WHATSAPP_1} 
                  <MessageCircle size={14} className="text-green-500" />
                </span>
              </a>
            </li>
            <li>
              <a 
                href={`https://wa.me/${CONFIG.CONTACT.WHATSAPP_2}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col group"
              >
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{CONFIG.CONTACT.NAME_2}</span>
                <span className="text-sm font-bold text-fancy-charcoal group-hover:text-fancy-maroon transition-colors flex items-center gap-2">
                  00{CONFIG.CONTACT.WHATSAPP_2}
                  <MessageCircle size={14} className="text-green-500" />
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-[11px] tracking-[0.4em] uppercase font-bold text-fancy-charcoal mb-8 border-b border-fancy-maroon w-fit pb-1">{t('footer.hqHeader')}</h4>
          <p className="text-[12px] font-medium leading-loose text-gray-500">
            {t('footer.address').split(', ').map((line: string, i: number) => (
              <span key={i}>{line}{i < t('footer.address').split(', ').length - 1 && <br />}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Copyright & Developer */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold text-center md:text-left">
          {t('footer.copyright')}
        </div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-center md:text-right">
          <span className="text-gray-400">{t('footer.developedBy')} </span>
          <a 
            href="https://wajidalikhan-portfolio.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-fancy-maroon hover:underline underline-offset-4"
          >
            Wajid Ali Khan
          </a>
        </div>
      </div>
    </footer>
  );
}
