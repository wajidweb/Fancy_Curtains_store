'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LangSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ms' ? 'en' : 'ms';
    // If the pathname doesn't start with the locale (rare in this setup), just replace /
    const newPathname = pathname.startsWith(`/${locale}`) 
      ? pathname.replace(`/${locale}`, `/${nextLocale}`)
      : `/${nextLocale}${pathname}`;
    
    startTransition(() => {
      router.replace(newPathname);
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-4 py-1.5 text-[11px] font-bold tracking-wider border border-fancy-charcoal/30 rounded hover:bg-fancy-charcoal hover:text-white transition-all uppercase"
    >
      {locale === 'ms' ? 'English' : 'Bahasa Malaysia'}
    </button>
  );
}
