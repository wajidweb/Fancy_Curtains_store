'use client';

import { useTranslations, useLocale } from 'next-intl';
import { 
  ShoppingBag, 
  ChevronRight, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Ruler, 
  Phone,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FeaturedProducts from '@/components/shared/FeaturedProducts';
import CurtainHighlight from '@/components/shared/CurtainHighlight';
import FurnitureHighlight from '@/components/shared/FurnitureHighlight';
import TestimonialSection from '@/components/shared/TestimonialSection';
import Footer from '@/components/shared/Footer';
import { CONFIG } from '@/config';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const heroImage = '/herobg.jpg';
  
  const collections = [
    {
      title: t('collections.curtains.title'),
      tagline: t('collections.curtains.tagline'),
      image: 'https://images.unsplash.com/photo-1577926606472-fc6d3a33f7e1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1000&auto=format&fit=crop',
      color: 'bg-fancy-maroon',
      category: 'curtains'
    },
    {
      title: t('collections.furniture.title'),
      tagline: t('collections.furniture.tagline'),
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
      color: 'bg-fancy-charcoal',
      category: 'furniture'
    }
  ];

  const features = [
    { icon: Ruler, title: t('features.measurement.title'), desc: t('features.measurement.desc') },
    { icon: ShieldCheck, title: t('features.quality.title'), desc: t('features.quality.desc') },
    { icon: Truck, title: t('features.delivery.title'), desc: t('features.delivery.desc') },
  ];

  return (
    <div className="bg-[#fcfcf9] min-h-screen text-fancy-charcoal overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background with Zoom Effect */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={heroImage} 
            alt="Luxury Interior" 
            className="w-full h-full object-cover blur-[1px]"
          />
          <div className="absolute inset-0 bg-black/40 md:bg-black/60"></div>
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full pt-20 md:pt-0">
          <div className="max-w-full md:max-w-3xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8"
            >
              <div className="w-8 md:w-12 h-[1px] bg-fancy-maroon"></div>
              <span className="text-[9px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold text-white/80">
                {t('exclusiveCollection')}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-5xl sm:text-6xl md:text-8xl leading-[1.1] md:leading-[0.9] mb-6 md:mb-10 tracking-tight font-bold w-full"
            >
              {t('heroTitle')}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-base md:text-2xl font-medium mb-8 md:mb-14 max-w-xl leading-relaxed text-white/90"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6"
            >
              <Link 
                href={`/${locale}/products`}
                className="bg-fancy-maroon text-white px-8 md:px-12 py-4 md:py-6 text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-fancy-maroon transition-all duration-500 shadow-xl group flex items-center justify-center gap-3"
              >
                {t('exploreShop')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href={`/${locale}/services`}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 md:px-12 py-4 md:py-6 text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-fancy-maroon transition-all duration-500 flex items-center justify-center"
              >
                {t('bookConsultation')}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-bold">{t('scroll')}</span>
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-fancy-maroon to-transparent"></div>
        </motion.div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {features.map((f, i) => (
            <div key={i} className="flex items-center p-8 md:p-12 gap-6 md:gap-8 hover:bg-gray-50 transition-colors group">
              <f.icon className="text-fancy-maroon group-hover:scale-110 transition-transform shrink-0" size={32} strokeWidth={1} />
              <div>
                <h4 className="text-sm font-bold tracking-widest uppercase mb-1 md:mb-2">{f.title}</h4>
                <p className="text-[11px] md:text-xs text-gray-500 font-medium tracking-wide leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SPLIT COLLECTION */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-[1800px] mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {collections.map((col, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className={`relative group h-[450px] md:h-[600px] lg:h-[700px] overflow-hidden ${col.color} rounded-md shadow-xl`}
              >
                <img 
                  src={col.image} 
                  alt={col.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 group-hover:opacity-30 transition-all duration-1000"
                />
                <div className="relative h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 text-white">
                  <span className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-4 md:mb-6 opacity-90">{t('collections.badge')}</span>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-8 leading-tight max-w-lg font-bold">{col.title}</h2>
                  <p className="text-sm md:text-xl font-medium mb-8 md:mb-14 opacity-90 italic max-w-md leading-relaxed">{col.tagline}</p>
                  <Link 
                    href={`/${locale}/products?category=${col.category}`}
                    className="w-fit flex items-center text-[11px] md:text-xs tracking-[0.3em] uppercase font-bold border-b border-white pb-3 hover:translate-x-3 transition-transform duration-300"
                  >
                    {t('collections.viewAll')} <ArrowRight size={18} className="ml-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS COMPONENT */}
      <FeaturedProducts />

      {/* CURTAIN HIGHLIGHT SECTION */}
      <CurtainHighlight />

      {/* FURNITURE HIGHLIGHT SECTION */}
      <FurnitureHighlight />

      {/* TESTIMONIALS SECTION */}
      <TestimonialSection />

      {/* 6. PREMIUM CONSULTATION CTA */}
      <section className="bg-fancy-charcoal py-24 md:py-32 text-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            
            {/* Left: Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] tracking-[0.3em] uppercase font-bold mb-8">
                {t('consultation.badge')}
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-white">
                {t('consultation.title')}
              </h2>
              <p className="text-base md:text-lg font-medium text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('consultation.subtitle')}
              </p>
              
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center justify-center gap-4 bg-white text-fancy-charcoal px-8 py-5 text-xs tracking-[0.3em] uppercase font-black hover:bg-fancy-maroon hover:text-white transition-all duration-300 rounded-sm shadow-md"
              >
                <Calendar size={18} />
                {t('consultation.bookAppointment')} 
              </Link>
            </div>

            {/* Right: Contact Cards */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              {[
                { name: CONFIG.CONTACT.NAME_1, phone: `00${CONFIG.CONTACT.WHATSAPP_1}`, wa: CONFIG.CONTACT.WHATSAPP_1, role: "Senior Designer" },
                { name: CONFIG.CONTACT.NAME_2, phone: `00${CONFIG.CONTACT.WHATSAPP_2}`, wa: CONFIG.CONTACT.WHATSAPP_2, role: "Textile Expert" }
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a2a2a] border border-gray-700 hover:border-gray-500 rounded-xl p-6 md:p-8 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 shadow-sm">
                          <User size={24} className="text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#2a2a2a] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold tracking-tight text-white mb-1">{contact.name}</h4>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">{contact.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <a 
                        href={`tel:${contact.phone}`}
                        className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-white hover:bg-white hover:text-fancy-charcoal transition-colors shadow-sm"
                        title={t('consultation.callNow')}
                      >
                        <Phone size={18} />
                      </a>
                      <a 
                        href={`https://wa.me/${contact.wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-white hover:bg-[#25D366] hover:border-[#25D366] transition-colors shadow-sm"
                        title={t('consultation.whatsapp')}
                      >
                        <MessageCircle size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
