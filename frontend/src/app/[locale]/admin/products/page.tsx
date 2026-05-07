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
    fetchProducts();
  }, []);

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



  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fancy-charcoal tracking-tight uppercase">Manage Products</h1>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mt-2">Add, edit, or remove store items</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: { ms: '', en: '' }, slug: '', description: { ms: '', en: '' }, price: 0, category: 'curtains', stock: 0, images: [''] });
            setIsModalOpen(true);
          }}
          className="bg-fancy-charcoal text-white px-6 py-3 rounded-sm flex items-center justify-center font-bold text-xs tracking-[0.2em] uppercase hover:bg-fancy-maroon transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#fcfcf9]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Product</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Price</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Stock</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product: any) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img className="h-12 w-12 rounded-sm object-cover border border-gray-100" src={product.images[0]} alt="" />
                    </div>
                    <div className="ml-4 text-sm font-bold text-fancy-charcoal">{product.name[locale]}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">RM {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData({ ...product });
                      setIsModalOpen(true);
                    }}
                    className="text-fancy-charcoal hover:text-fancy-maroon transition-colors mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
           <div className="py-12 text-center">
             <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">No products found.</p>
           </div>
        )}
      </div>

      {/* Basic Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-fancy-charcoal uppercase tracking-wider mb-8">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Name (MS)</label>
                  <input 
                    className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                    value={formData.name.ms}
                    onChange={(e) => setFormData({...formData, name: {...formData.name, ms: e.target.value}})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Name (EN)</label>
                  <input 
                    className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                    value={formData.name.en}
                    onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">URL Slug</label>
                <input 
                  placeholder="e.g. blackout-curtain" 
                  className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Price (RM)</label>
                  <input 
                    type="number" 
                    className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Description (MS)</label>
                <textarea 
                  rows={3}
                  className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                  value={formData.description.ms}
                  onChange={(e) => setFormData({...formData, description: {...formData.description, ms: e.target.value}})}
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Description (EN)</label>
                <textarea 
                  rows={3}
                  className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                  value={formData.description.en}
                  onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Primary Image URL</label>
                <input 
                  className="p-3 bg-[#fcfcf9] border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                  value={formData.images[0]}
                  onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-fancy-charcoal text-white px-8 py-3 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-fancy-maroon transition-colors shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
