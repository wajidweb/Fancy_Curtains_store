'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FurnitureHighlight() {
  const locale = useLocale();

  return (
    <section className="py-24 md:py-40 bg-[#f8f8f6] overflow-hidden font-sans border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8 md:px-20 lg:px-32 relative">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-0">
          
          {/* LEFT SIDE: IMAGE & SHAPE */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
            {/* Background Geometric Shape (Different color/position) */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white rounded-full lg:rounded-[100px] lg:rounded-tl-none lg:rounded-bl-none -left-20 lg:-left-32 z-0 shadow-sm"
            ></motion.div>

            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 w-full max-w-[500px] lg:max-w-none px-4"
            >
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop" 
                alt="Furniture Collection" 
                className="w-full h-auto object-cover rounded-sm shadow-2xl scale-110 lg:scale-125"
              />
              
              {/* Floating Decorative Element */}
              <div className="hidden lg:block absolute -bottom-10 right-10 w-40 h-56 border border-gray-300 -z-10 rounded-sm"></div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: TYPOGRAPHY */}
          <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-center lg:items-end text-center lg:text-right">
            {/* Vertical Year */}
            <div className="hidden lg:block absolute -right-12 top-0">
              <span className="text-gray-200 text-6xl font-bold tracking-tighter [writing-mode:vertical-rl]">
                2026
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[80px] md:text-[120px] leading-[0.85] font-extrabold text-fancy-charcoal tracking-tighter uppercase mb-6">
                FURN<br />ITURE
              </h2>
              <h3 className="text-sm md:text-lg tracking-[0.6em] md:tracking-[0.8em] font-extrabold text-fancy-charcoal uppercase mb-12 opacity-90">
                Premium Sofa & Home
              </h3>
              
              <Link 
                href={`/${locale}/products?category=furniture`}
                className="group inline-flex items-center gap-4 text-xs md:text-sm font-extrabold tracking-[0.4em] uppercase text-fancy-charcoal hover:text-fancy-maroon transition-all duration-300"
              >
                <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-2 transition-transform" />
                <span className="w-12 h-[1px] bg-fancy-charcoal group-hover:bg-fancy-maroon group-hover:w-20 transition-all duration-500"></span>
                Explore
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
