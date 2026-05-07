'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Users,
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Services', href: '/admin/services', icon: Users },
];

export default function AdminSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 text-fancy-charcoal transition-all duration-300 shadow-sm">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-100">
        <Link href={`/${locale}/admin/dashboard`} className="flex items-center" onClick={onLinkClick}>
          <img 
            src="/logo1.jpeg" 
            alt="Fancy Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-8 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={`/${locale}${item.href}`}
              onClick={onLinkClick}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all duration-200 text-xs font-bold tracking-[0.2em] uppercase shadow-sm ${
                isActive 
                  ? 'bg-fancy-maroon text-white scale-105' 
                  : 'bg-[#fcfcf9] text-gray-500 hover:bg-fancy-charcoal hover:text-white border border-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-[#fcfcf9]">
        <button
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-3 px-4 py-3.5 rounded-sm text-xs font-bold tracking-[0.2em] uppercase text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
