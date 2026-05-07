'use client';

import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = useAuthStore((state) => state.user);
  const locale = useLocale();

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Link href={`/${locale}`} className="text-xs font-bold uppercase tracking-widest text-fancy-charcoal hover:text-fancy-maroon transition-colors hidden sm:block">
            View Store
          </Link>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-fancy-charcoal text-white flex items-center justify-center font-bold text-sm uppercase">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-bold leading-6 text-gray-900 uppercase tracking-wider" aria-hidden="true">
                {user?.name || 'Admin'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
