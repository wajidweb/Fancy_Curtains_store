'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import axios from 'axios';
import { ShoppingBag, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { CONFIG } from '@/config';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalServices: 0,
    revenue: 0
  });

  useEffect(() => {
    if (!isAdmin()) {
      router.push(`/${locale}/login`);
    }
    
    // Fetch dashboard stats (mocking for now, would be a real API)
    const fetchStats = async () => {
      try {
        const productRes = await axios.get(`${CONFIG.API_URL}/products`);
        // In a real app, we'd have a specific stats endpoint
        setStats({
          totalOrders: 12, // Mock
          totalProducts: productRes.data.length,
          totalServices: 5, // Mock
          revenue: 1450.50 // Mock
        });
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };

    fetchStats();
  }, [isAdmin, router, locale]);

  if (!isAdmin()) return null;

  const cards = [
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { name: 'Products', value: stats.totalProducts, icon: ClipboardList, color: 'bg-emerald-500' },
    { name: 'Service Requests', value: stats.totalServices, icon: Users, color: 'bg-amber-500' },
    { name: 'Revenue', value: `RM ${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-emerald-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {cards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:scale-105">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-emerald-800 mb-4 flex justify-between items-center">
            Recent Orders
            <button className="text-sm text-emerald-600 hover:underline">View All</button>
          </h2>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-center py-8 italic">Order management list will be implemented next...</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-emerald-800 mb-4 flex justify-between items-center">
            Service Requests
            <button className="text-sm text-emerald-600 hover:underline">View All</button>
          </h2>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-center py-8 italic">Service request list will be implemented next...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
