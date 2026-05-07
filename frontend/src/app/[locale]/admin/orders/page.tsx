'use client';

export default function AdminOrdersPage() {
  const mockOrders = [
    { id: '#ORD-202601', customer: 'Ahmad bin Ali', date: 'May 7, 2026', status: 'Processing', total: 'RM 1,250.00' },
    { id: '#ORD-202602', customer: 'Sarah Tan', date: 'May 6, 2026', status: 'Shipped', total: 'RM 850.50' },
    { id: '#ORD-202603', customer: 'Mohd Faisal', date: 'May 5, 2026', status: 'Delivered', total: 'RM 2,100.00' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fancy-charcoal tracking-tight uppercase">Manage Orders</h1>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mt-2">View and process customer orders</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#fcfcf9]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Order ID</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Customer</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-fancy-charcoal">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-sm uppercase tracking-wider ${
                    order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-fancy-charcoal">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {mockOrders.length === 0 && (
           <div className="py-12 text-center">
             <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">No orders found.</p>
           </div>
        )}
      </div>
    </div>
  );
}
