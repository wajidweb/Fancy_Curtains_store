'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: { ms: string; en: string };
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Siti Nurhaliza",
    location: "Kuala Lumpur",
    text: {
      ms: "Kualiti langsir di Fancy memang luar biasa. Bilik tidur saya kini nampak lebih mewah dan elegan. Perkhidmatan ukuran juga sangat profesional!",
      en: "The curtain quality at Fancy is truly extraordinary. My bedroom now looks more luxurious and elegant. The measurement service was also very professional!"
    },
    rating: 5
  },
  {
    id: 2,
    name: "Tan Wei Meng",
    location: "Petaling Jaya",
    text: {
      ms: "Saya sangat berpuas hati dengan sofa yang saya beli. Sangat selesa dan reka bentuknya sesuai dengan ruang tamu minimalis saya. Terbaik!",
      en: "I am very satisfied with the sofa I bought. Extremely comfortable and the design fits my minimalist living room perfectly. Excellent!"
    },
    rating: 5
  },
  {
    id: 3,
    name: "Ramasamy",
    location: "Shah Alam",
    text: {
      ms: "Penghantaran pantas dan pemasangan langsir dilakukan dengan sangat kemas. Kakitangan mereka sangat peramah dan membantu.",
      en: "Swift delivery and the curtain installation was done very neatly. Their staff are very friendly and helpful."
    },
    rating: 5
  }
];

export default function TestimonialSection() {
  const locale = useLocale() as 'ms' | 'en';
  const t = useTranslations('Testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <section className="py-12 md:py-16 bg-white font-sans overflow-hidden border-b border-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-fancy-maroon mb-2">{t('badge')}</h3>
          <h2 className="text-2xl md:text-3xl font-bold text-fancy-charcoal tracking-tight">{t('title')}</h2>
        </div>

        <div className="relative flex justify-center items-center h-[300px] md:h-[250px]">
          {/* Navigation Buttons - Smaller and positioned relative to container */}
          <div className="absolute left-0 z-20">
            <button 
              onClick={prevSlide}
              className="p-2 md:p-3 rounded-full border border-gray-100 bg-white text-fancy-charcoal hover:bg-fancy-maroon hover:text-white transition-all shadow-sm group"
            >
              <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
            </button>
          </div>

          <div className="absolute right-0 z-20">
            <button 
              onClick={nextSlide}
              className="p-2 md:p-3 rounded-full border border-gray-100 bg-white text-fancy-charcoal hover:bg-fancy-maroon hover:text-white transition-all shadow-sm group"
            >
              <ChevronRight size={20} className="group-active:scale-90 transition-transform" />
            </button>
          </div>

          {/* Review Card - Fixed height container to prevent layout shift */}
          <div className="w-full max-w-3xl px-12 md:px-16 relative h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.4, ease: "easeOut" },
                  opacity: { duration: 0.3 }
                }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <div className="bg-fancy-maroon/5 p-3 rounded-full mb-4">
                  <Quote size={24} className="text-fancy-maroon" fill="currentColor" fillOpacity={0.1} />
                </div>

                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-3.5 h-3.5 bg-yellow-400 rounded-full shadow-sm"></div>
                  ))}
                </div>

                <p className="text-base md:text-lg font-medium leading-relaxed text-fancy-charcoal mb-6 italic max-w-2xl">
                  "{TESTIMONIALS[currentIndex].text[locale]}"
                </p>

                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-bold text-fancy-maroon uppercase tracking-widest mb-0.5">
                    {TESTIMONIALS[currentIndex].name}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    {TESTIMONIALS[currentIndex].location}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Dots - Smaller and closer */}
        <div className="flex justify-center gap-2 mt-4">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1 transition-all duration-500 rounded-full ${currentIndex === index ? 'w-6 bg-fancy-maroon' : 'w-1.5 bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
