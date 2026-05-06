import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const statusMap = {
  pending: { label: 'Inasubiri', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  paid: { label: 'Imelipwa', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
  processing: { label: 'Inachakatwa', icon: Package, color: 'text-purple-600 bg-purple-50' },
  shipped: { label: 'Imetumwa', icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
  delivered: { label: 'Imefika', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Imeghairiwa', icon: Clock, color: 'text-red-600 bg-red-50' },
};

export default function OrdersPage() {
  const { user, isAuthenticated, login } = useAuth();
  const orders = useQuery(api.orders.getByUser, user?._id ? { userId: user._id } : 'skip');

  if (!isAuthenticated) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Tafadhali ingia kwanza</h2>
      <button onClick={login} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold">Ingia Sasa</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Maagizo Yangu</h1>
      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200"><Package className="mx-auto h-12 w-12 text-gray-300 mb-4" /><p className="text-gray-500">Bado hujafanya agizo lolote.</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const s = statusMap[order.status];
            const Icon = s.icon;
            return (
              <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Agizo #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('sw-KE')}</p>
                    </div>
                    <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${s.color}`}><Icon className="h-4 w-4 mr-1" />{s.label}</span>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1"><p className="font-medium text-gray-900">{item.name}</p><p className="text-sm text-gray-500">x{item.quantity}</p></div>
                        <span className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-gray-600">Jumla</span>
                    <span className="text-xl font-bold text-gray-900">KSh {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}