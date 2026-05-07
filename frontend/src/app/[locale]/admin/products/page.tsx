'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';
import { CONFIG } from '@/config';

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const locale = useLocale() as 'ms' | 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const initialFormState = {
    name: { ms: '', en: '' },
    description: { ms: '', en: '' },
    price: 0,
    category: 'curtains',
    stock: 0,
    images: [] as string[],
    isFeatured: false,
    isActive: true,
    specifications: {
      material: { ms: '', en: '' },
      weight: { ms: '', en: '' },
      origin: { ms: '', en: '' },
      opacity: { ms: '', en: '' },
    },
    careInstructions: { ms: '', en: '' }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${CONFIG.API_URL}/products?all=true`);
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
    if (confirm('Are you sure you want to delete this product?')) {
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
      const submitData = new FormData();
      
      // Auto-generate slug from English name
      const slug = formData.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      submitData.append('data', JSON.stringify({
        ...formData,
        slug
      }));

      selectedFiles.forEach(file => {
        submitData.append('images', file);
      });

      if (editingProduct) {
        await axios.put(`${CONFIG.API_URL}/products/${editingProduct._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${CONFIG.API_URL}/products`, submitData, {
          headers: { 
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setSelectedFiles([]);
      setPreviewUrls([]);
      fetchProducts();
    } catch (err) {
      alert('Save failed. Please check your data.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // Cleanup memory
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const openModalForNew = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const openModalForEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || { ms: '', en: '' },
      description: product.description || { ms: '', en: '' },
      price: product.price || 0,
      category: product.category || 'curtains',
      stock: product.stock || 0,
      images: product.images || [],
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
      specifications: product.specifications || initialFormState.specifications,
      careInstructions: product.careInstructions || initialFormState.careInstructions,
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fancy-charcoal tracking-tight uppercase">Manage Products</h1>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mt-2">Add, edit, or remove store items</p>
        </div>
        <button 
          onClick={openModalForNew}
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
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Category</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
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
                    <div className="h-12 w-12 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-sm border border-gray-100 overflow-hidden">
                      {product.images?.[0] ? (
                        <img 
                          className="h-full w-full object-cover" 
                          src={product.images[0].startsWith('http') ? product.images[0] : `${CONFIG.API_URL.replace('/api', '')}${product.images[0]}`} 
                          alt="" 
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-fancy-charcoal">{product.name[locale]}</div>
                      <div className="text-xs text-gray-400 mt-1">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-[10px] tracking-widest font-bold uppercase bg-gray-100 text-gray-600 rounded-sm">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.isFeatured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">RM {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  <span className={product.stock <= 5 ? 'text-red-500 font-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openModalForEdit(product)}
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

      {/* Advanced Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-[100] overflow-y-auto pt-12 pb-12">
          <div className="bg-white rounded-sm shadow-xl max-w-5xl w-full">
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white z-20">
              <h2 className="text-xl md:text-2xl font-extrabold text-fancy-charcoal uppercase tracking-wider">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-fancy-maroon transition-colors bg-gray-50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Left Column: Basic Info & Specs */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Basic Info */}
                  <div className="bg-[#fcfcf9] p-5 md:p-6 border border-gray-100 rounded-sm space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Name (English)</label>
                        <input 
                          className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                          value={formData.name.en}
                          onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Name (Malay)</label>
                        <input 
                          className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                          value={formData.name.ms}
                          onChange={(e) => setFormData({...formData, name: {...formData.name, ms: e.target.value}})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Description (English)</label>
                      <textarea 
                        rows={3}
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                        value={formData.description.en}
                        onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Description (Malay)</label>
                      <textarea 
                        rows={3}
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                        value={formData.description.ms}
                        onChange={(e) => setFormData({...formData, description: {...formData.description, ms: e.target.value}})}
                      />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="bg-[#fcfcf9] p-5 md:p-6 border border-gray-100 rounded-sm space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2">Specifications (Optional)</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Material (EN)</label>
                        <input 
                          className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                          value={formData.specifications?.material?.en || ''}
                          onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, material: {...formData.specifications.material, en: e.target.value}}})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Material (MS)</label>
                        <input 
                          className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                          value={formData.specifications?.material?.ms || ''}
                          onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, material: {...formData.specifications.material, ms: e.target.value}}})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Weight (EN)</label>
                        <input 
                          className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                          value={formData.specifications?.weight?.en || ''}
                          onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, weight: {...formData.specifications.weight, en: e.target.value}}})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Origin (EN)</label>
                        <input 
                          className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                          value={formData.specifications?.origin?.en || ''}
                          onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, origin: {...formData.specifications.origin, en: e.target.value}}})}
                        />
                      </div>
                    </div>
                    
                    {formData.category === 'curtains' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                         <div>
                           <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Opacity (EN)</label>
                           <input 
                             className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                             value={formData.specifications?.opacity?.en || ''}
                             onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, opacity: {...formData.specifications.opacity, en: e.target.value}}})}
                           />
                         </div>
                       </div>
                    )}
                  </div>

                  {/* Care Instructions */}
                  <div className="bg-[#fcfcf9] p-5 md:p-6 border border-gray-100 rounded-sm space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2">Care Instructions (Optional)</h3>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Instructions (English)</label>
                      <textarea 
                        rows={2}
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                        value={formData.careInstructions?.en || ''}
                        onChange={(e) => setFormData({...formData, careInstructions: {...formData.careInstructions, en: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Instructions (Malay)</label>
                      <textarea 
                        rows={2}
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                        value={formData.careInstructions?.ms || ''}
                        onChange={(e) => setFormData({...formData, careInstructions: {...formData.careInstructions, ms: e.target.value}})}
                      />
                    </div>
                  </div>

                </div>

                {/* Right Column: Organization & Media & Pricing */}
                <div className="space-y-6">
                  
                  <div className="bg-[#fcfcf9] p-5 md:p-6 border border-gray-100 rounded-sm space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2">Pricing & Inventory</h3>
                    
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Price (RM)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Stock Quantity</label>
                      <input 
                        type="number" 
                        min="0"
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-[#fcfcf9] p-5 md:p-6 border border-gray-100 rounded-sm space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2">Organization</h3>
                    
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Category</label>
                      <select 
                        className="p-3 bg-white border border-gray-200 focus:border-fancy-maroon rounded-sm w-full outline-none transition-all text-sm uppercase tracking-wider"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="curtains">Curtains</option>
                        <option value="furniture">Furniture</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center space-x-3 cursor-pointer w-fit">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-fancy-maroon focus:ring-fancy-maroon border-gray-300 rounded-sm"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest text-fancy-charcoal">Active (Visible)</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer w-fit">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-fancy-maroon focus:ring-fancy-maroon border-gray-300 rounded-sm"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest text-fancy-charcoal">Featured Product</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#fcfcf9] p-5 md:p-6 border border-gray-100 rounded-sm space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2">Product Images</h3>
                    
                    <input 
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                    
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 text-fancy-charcoal px-4 py-8 rounded-sm text-xs font-bold tracking-widest uppercase transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Upload size={24} className="text-gray-400" />
                      Click to upload images
                    </button>

                    {(formData.images.length > 0 || previewUrls.length > 0) ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {/* Existing Images */}
                        {formData.images.map((img, index) => (
                          <div key={`existing-${index}`} className="relative group rounded-sm overflow-hidden border border-gray-200 bg-white aspect-square flex items-center justify-center">
                            <img src={img.startsWith('http') ? img : `${CONFIG.API_URL.replace('/api', '')}${img}`} alt={`Saved ${index}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => removeExistingImage(index)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {index === 0 && (
                              <span className="absolute top-1 left-1 bg-fancy-charcoal text-white text-[8px] uppercase tracking-widest px-1.5 py-0.5 font-bold rounded-sm">Primary</span>
                            )}
                          </div>
                        ))}
                        {/* New Upload Previews */}
                        {previewUrls.map((url, index) => (
                          <div key={`new-${index}`} className="relative group rounded-sm overflow-hidden border-2 border-fancy-maroon bg-white aspect-square flex items-center justify-center">
                            <img src={url} alt={`New ${index}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => removeNewImage(index)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <span className="absolute top-1 right-1 bg-fancy-maroon text-white text-[8px] uppercase tracking-widest px-1.5 py-0.5 font-bold rounded-sm">New</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-400 text-[10px] tracking-widest uppercase font-bold">
                        No images uploaded
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-100 sticky bottom-0 bg-white py-4 z-10">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:bg-gray-50 transition-colors border border-gray-200 rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-fancy-charcoal text-white px-8 py-3 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-fancy-maroon transition-colors shadow-md"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

