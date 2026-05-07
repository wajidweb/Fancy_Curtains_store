'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { CONFIG } from '@/config';
import { MessageCircle, MapPin, Calendar, Check, X, ClipboardList, Send, Edit } from 'lucide-react';

interface ServiceRequest {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  preferredDate: string;
  notes: string;
  adminNotes: string;
  status: string;
  createdAt: string;
  product?: {
    _id: string;
    name: { ms: string; en: string };
    images: string[];
    price: number;
    slug: string;
  };
}

export default function AdminServicesPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('');

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${CONFIG.API_URL}/services`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch service requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openModal = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setAdminNotes(req.adminNotes || '');
    setStatus(req.status);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    try {
      await axios.put(`${CONFIG.API_URL}/services/${selectedRequest._id}/status`, {
        status,
        adminNotes
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setIsModalOpen(false);
      fetchRequests();
    } catch (err) {
      alert('Failed to update request.');
    }
  };

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fancy-charcoal tracking-tight uppercase">Service Requests</h1>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mt-2">Manage consultation and measurement bookings</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#fcfcf9]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Customer</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Service</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Contact</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Date Requested</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-fancy-charcoal">{req.name}</div>
                  <div className="text-xs text-gray-400 max-w-[200px] truncate" title={req.address}>{req.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{req.serviceType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{req.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-sm uppercase tracking-wider ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openModal(req)}
                    className="bg-[#fcfcf9] border border-gray-200 text-fancy-charcoal px-4 py-2 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-fancy-charcoal hover:text-white transition-colors"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && !loading && (
           <div className="py-12 text-center">
             <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">No service requests found.</p>
           </div>
        )}
      </div>

      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-sm shadow-xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-fancy-charcoal uppercase tracking-wider flex items-center gap-2">
                <ClipboardList size={20} className="text-fancy-maroon" />
                Service Request Details
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-fancy-maroon transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Customer Info Box */}
              <div className="bg-[#fcfcf9] p-6 border border-gray-100 rounded-sm">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2 mb-4">Customer Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Name</p>
                    <p className="text-sm font-bold text-fancy-charcoal">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Phone</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-fancy-charcoal">{selectedRequest.phone}</p>
                      <a 
                        href={`https://wa.me/${selectedRequest.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white p-1.5 rounded-sm hover:bg-green-600 transition-colors shadow-sm ml-2"
                        title="WhatsApp Customer"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-fancy-maroon mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{selectedRequest.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Info Box */}
              <div className="space-y-8">
                <div className="bg-[#fcfcf9] p-6 border border-gray-100 rounded-sm">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-fancy-charcoal border-b border-gray-200 pb-2 mb-4">Request Info</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Service Required</p>
                      <p className="text-sm font-extrabold text-fancy-maroon">{selectedRequest.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Preferred Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <p className="text-sm font-bold text-gray-700">{selectedRequest.preferredDate ? new Date(selectedRequest.preferredDate).toLocaleDateString() : 'Flexible'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Customer Notes</p>
                      <p className="text-sm text-gray-600 italic">{selectedRequest.notes || 'No extra notes provided.'}</p>
                    </div>
                  </div>
                </div>

                {/* Linked Product Box */}
                {selectedRequest.product && (
                  <div className="bg-[#fcfcf9] p-6 border border-fancy-maroon/20 rounded-sm">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-fancy-maroon border-b border-fancy-maroon/20 pb-2 mb-4 flex items-center gap-2">
                      Target Product
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-sm overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                        {selectedRequest.product.images?.[0] ? (
                          <img 
                            src={selectedRequest.product.images[0].startsWith('http') ? selectedRequest.product.images[0] : `${CONFIG.API_URL.replace('/api', '')}${selectedRequest.product.images[0]}`} 
                            alt="Product" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-fancy-charcoal">{selectedRequest.product.name?.en || 'Unknown Product'}</p>
                        <p className="text-xs text-fancy-maroon font-bold mt-1">RM {selectedRequest.product.price?.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">#{selectedRequest.product.slug}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Management Controls */}
            <div className="border-t border-gray-200 pt-8 space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-fancy-charcoal mb-4 flex items-center gap-2">
                <Edit size={16} className="text-fancy-maroon" /> Manage Workspace
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Workflow Status</label>
                  <select
                    className="w-full p-3 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm outline-none transition-all text-sm font-bold uppercase tracking-wider text-fancy-charcoal"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Measurement Scheduled">Measurement Scheduled</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2 block">Internal Admin Notes (Private)</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 bg-white border border-gray-200 focus:border-fancy-maroon focus:ring-1 focus:ring-fancy-maroon rounded-sm outline-none transition-all text-sm"
                    placeholder="E.g. Measurements taken on 12 May, quoting RM450..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={handleUpdate}
                  className="bg-fancy-charcoal text-white px-8 py-3 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-fancy-maroon transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
