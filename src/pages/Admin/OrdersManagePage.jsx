import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Loader2, Search } from 'lucide-react';
import Button from '../../components/ui/Button';

const statusOptions = [
  { value: 'pending', label: 'Inasubiri', color: 'bg-amber-100 text-amber-800' },
  { value: 'paid', label: 'Imelipwa', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Inachakatwa', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Imetumwa', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Imefika', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Imeghairiwa', color: 'bg-red-100 text-red-800' },
];

export default function OrdersManagePage() {
  const { isAdmin, isLoading } = useAuth();
  const orders = useQuery(api.orders.getAll);
  const updateStatus = useMutation(api.orders.updateStatus);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (isLoading) return <div className="p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const filteredOrders = orders?.filter(o => {
    const matchesSearch = o._id.toLowerCase().includes(search.toLowerCase()) || 
                          o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusChange = async (orderId, newStatus) => {
    await updateStatus({ id: orderId, status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Simamia Maagizo</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tafuta kwa namba au jina..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Hali Zote</option>
          {statusOptions.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Namba ya Agizo</th>
                <th className="px-4 py-3">Mteja</th>
                <th className="px-4 py-3">Bidhaa</th>
                <th className="px-4 py-3">Jumla</th>
                <th className="px-4 py-3">Hali</th>
                <th className="px-4 py-3">Tarehe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{order._id.slice(-8)}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.shippingAddress?.name}</p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{order.items.length} bidhaa</td>
                  <td className="px-4 py-3 font-bold">KSh {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select 
                      value={order.status} 
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusOptions.find(s => s.value === order.status)?.color || ''}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('sw-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}