'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { CONFIG } from '@/config';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import RevenueChart from '@/components/admin/RevenueChart';
import OrdersChart from '@/components/admin/OrdersChart';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboard() {
  const locale = useLocale();
  const { user } = useAuthStore();
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalServices: 0,
    revenue: 0
  });

  useEffect(() => {
    // Fetch dashboard stats (mocking for now, would be a real API)
    const fetchStats = async () => {
      try {
        const productRes = await axios.get(`${CONFIG.API_URL}/products?all=true`);
        
        let servicesRes = { data: [] };
        if (user?.token) {
           servicesRes = await axios.get(`${CONFIG.API_URL}/services`, {
             headers: { Authorization: `Bearer ${user.token}` }
           });
        }
        
        setRecentServices(servicesRes.data.slice(0, 5));

        setStats({
          totalOrders: 12, // Mock
          totalProducts: productRes.data.length,
          totalServices: servicesRes.data.length,
          revenue: 1450.50 // Mock
        });
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };

    if (user?.token) {
      fetchStats();
    }
  }, [user]);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Contacted': return 'bg-blue-100 text-blue-800';
      case 'Measurement Scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'Quotation Sent': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cards = [
    { name: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'bg-fancy-charcoal text-white' },
    { name: 'Products', value: stats.totalProducts, icon: ShoppingBag, color: 'bg-[#fcfcf9] text-fancy-charcoal border border-gray-200' },
    { name: 'Service Requests', value: stats.totalServices, icon: Users, color: 'bg-[#fcfcf9] text-fancy-charcoal border border-gray-200' },
    { name: 'Revenue', value: `RM ${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'bg-fancy-maroon text-white' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-fancy-charcoal tracking-tight uppercase">Admin Dashboard</h1>
        <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mt-2">Overview of your store's performance</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {cards.map((item) => (
          <div key={item.name} className={`overflow-hidden shadow-sm rounded-sm transition-transform hover:-translate-y-1 ${item.color}`}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-8 w-8 opacity-80" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-extrabold tracking-tight mt-1">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-fancy-charcoal uppercase tracking-wider mb-2">
            Revenue Overview
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6">Last 6 Months</p>
          <div className="border-t border-gray-100 pt-4">
            <RevenueChart />
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-fancy-charcoal uppercase tracking-wider mb-2">
            Orders by Status
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6">Current Distribution</p>
          <div className="border-t border-gray-100 pt-4">
            <OrdersChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-fancy-charcoal uppercase tracking-wider mb-6 flex justify-between items-center">
            Recent Orders
            <Link href={`/${locale}/admin/orders`} className="text-[10px] tracking-[0.2em] text-fancy-maroon hover:text-fancy-charcoal transition-colors">
              VIEW ALL
            </Link>
          </h2>
          <div className="border-t border-gray-100 pt-8">
            <p className="text-gray-400 text-sm font-bold text-center py-8 tracking-widest uppercase">Order list appearing here soon</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-sm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-fancy-charcoal uppercase tracking-wider mb-6 flex justify-between items-center">
            Service Requests
            <Link href={`/${locale}/admin/services`} className="text-[10px] tracking-[0.2em] text-fancy-maroon hover:text-fancy-charcoal transition-colors">
              VIEW ALL
            </Link>
          </h2>
          <div className="border-t border-gray-100 pt-4">
            {recentServices.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {recentServices.map((req) => (
                  <li key={req._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-fancy-charcoal truncate">{req.name}</p>
                      <p className="text-xs text-gray-500">{req.serviceType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-[8px] font-bold rounded-sm uppercase tracking-wider ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm font-bold text-center py-8 tracking-widest uppercase">No recent requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
