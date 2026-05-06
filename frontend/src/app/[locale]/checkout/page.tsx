'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const locale = useLocale() as 'ms' | 'en';
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('cod');
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${locale}/login?redirect=checkout`);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: items,
        shippingDetails,
        paymentMethod,
        totalPrice: getTotalPrice(),
      };

      await axios.post('http://localhost:5001/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(true);
      clearCart();
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <CheckCircle size={80} className="text-emerald-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">
          {locale === 'ms' ? 'Pesanan Berjaya!' : 'Order Placed Successfully!'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {locale === 'ms' 
            ? 'Terima kasih atas pembelian anda. Kami akan memproses pesanan anda segera.' 
            : 'Thank you for your purchase. We are processing your order right now.'}
        </p>
        <button 
          onClick={() => router.push(`/${locale}/products`)}
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700"
        >
          {locale === 'ms' ? 'Kembali Membeli-belah' : 'Continue Shopping'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => router.back()} className="flex items-center text-emerald-700 mb-8 hover:underline">
        <ArrowLeft size={20} className="mr-2" />
        {locale === 'ms' ? 'Kembali' : 'Back'}
      </button>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Information */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-emerald-900">{locale === 'ms' ? 'Maklumat Penghantaran' : 'Shipping Information'}</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              name="fullName"
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder={locale === 'ms' ? 'Nama Penuh' : 'Full Name'}
              value={shippingDetails.fullName}
              onChange={handleChange}
            />
            <input
              name="phone"
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder={locale === 'ms' ? 'Nombor Telefon' : 'Phone Number'}
              value={shippingDetails.phone}
              onChange={handleChange}
            />
            <input
              name="address"
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder={locale === 'ms' ? 'Alamat' : 'Address'}
              value={shippingDetails.address}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={locale === 'ms' ? 'Bandar' : 'City'}
                value={shippingDetails.city}
                onChange={handleChange}
              />
              <input
                name="postalCode"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={locale === 'ms' ? 'Poskod' : 'Postal Code'}
                value={shippingDetails.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-emerald-900 pt-8">{locale === 'ms' ? 'Kaedah Pembayaran' : 'Payment Method'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-500'}`}
            >
              <Truck size={32} className="mb-2" />
              <span className="font-bold">COD</span>
              <span className="text-xs text-center">{locale === 'ms' ? 'Bayar masa terima' : 'Cash on Delivery'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('stripe')}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${paymentMethod === 'stripe' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-500'}`}
            >
              <CreditCard size={32} className="mb-2" />
              <span className="font-bold">Stripe</span>
              <span className="text-xs text-center">{locale === 'ms' ? 'Kad Kredit/FPX' : 'Credit Card/FPX'}</span>
            </button>
          </div>
        </div>

        {/* Order Summary Checkout */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">{locale === 'ms' ? 'Ringkasan Pesanan' : 'Order Summary'}</h2>
          <div className="divide-y divide-gray-100 mb-6">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex justify-between">
                <div>
                  <p className="font-bold text-emerald-900">{item.name[locale]} x {item.quantity}</p>
                  <p className="text-sm text-gray-500">{item.selectedVariant}</p>
                </div>
                <p className="font-bold">RM {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="flex justify-between text-xl font-bold text-emerald-900">
              <span>Total</span>
              <span>RM {getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? '...' : (locale === 'ms' ? 'Sahkan Pesanan' : 'Place Order')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
