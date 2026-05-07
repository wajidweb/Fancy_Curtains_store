'use client';

export default function AdminServicesPage() {
  const mockRequests = [
    { id: '#REQ-001', customer: 'Lim Wei', service: 'Curtain Measurement', date: 'May 8, 2026', status: 'Pending' },
    { id: '#REQ-002', customer: 'Siti Nurhaliza', service: 'Interior Consultation', date: 'May 9, 2026', status: 'Confirmed' },
  ];

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
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Request ID</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Customer</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Service</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Scheduled Date</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mockRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-fancy-charcoal">{req.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-sm uppercase tracking-wider ${
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mockRequests.length === 0 && (
           <div className="py-12 text-center">
             <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">No service requests found.</p>
           </div>
        )}
      </div>
    </div>
  );
}
