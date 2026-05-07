'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import axios from 'axios';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { CONFIG } from '@/config';

export default function AdminProductsPage() {
  const { user, isAdmin } = useAuthStore();
  const router = useRouter();
  const locale = useLocale() as 'ms' | 'en';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: { ms: '', en: '' },
    slug: '',
    description: { ms: '', en: '' },
    price: 0,
    category: 'curtains',
    stock: 0,
    images: [''],
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${CONFIG.API_URL}/products`);
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) router.push(`/${locale}/login`);
    fetchProducts();
  }, [isAdmin, router, locale]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${CONFIG.API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        fetchProducts();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`${CONFIG.API_URL}/products/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      } else {
        await axios.post(`${CONFIG.API_URL}/products`, formData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Save failed');
    }
  };

  if (!isAdmin()) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-900">Manage Products</h1>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: { ms: '', en: '' }, slug: '', description: { ms: '', en: '' }, price: 0, category: 'curtains', stock: 0, images: [''] });
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: any) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">{product.name[locale]}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData({ ...product });
                      setIsModalOpen(true);
                    }}
                    className="text-emerald-600 hover:text-emerald-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basic Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Name (MS)" 
                  className="p-2 border rounded w-full"
                  value={formData.name.ms}
                  onChange={(e) => setFormData({...formData, name: {...formData.name, ms: e.target.value}})}
                  required
                />
                <input 
                  placeholder="Name (EN)" 
                  className="p-2 border rounded w-full"
                  value={formData.name.en}
                  onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                  required
                />
              </div>
              <input 
                placeholder="Slug (e.g. blackout-curtain)" 
                className="p-2 border rounded w-full"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Price" 
                  className="p-2 border rounded w-full"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
                <input 
                  type="number" 
                  placeholder="Stock" 
                  className="p-2 border rounded w-full"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  required
                />
              </div>
              <textarea 
                placeholder="Description (MS)" 
                className="p-2 border rounded w-full"
                value={formData.description.ms}
                onChange={(e) => setFormData({...formData, description: {...formData.description, ms: e.target.value}})}
              />
              <textarea 
                placeholder="Description (EN)" 
                className="p-2 border rounded w-full"
                value={formData.description.en}
                onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
              />
              <input 
                placeholder="Image URL" 
                className="p-2 border rounded w-full"
                value={formData.images[0]}
                onChange={(e) => setFormData({...formData, images: [e.target.value]})}
              />
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
