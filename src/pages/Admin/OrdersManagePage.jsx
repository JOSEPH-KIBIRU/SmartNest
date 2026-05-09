import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Loader2, 
  Search,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
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
  const [expandedOrder, setExpandedOrder] = useState(null);

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
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <React.Fragment key={order._id}>
                  {/* Main Row */}
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <td className="px-4 py-3 font-medium">#{order._id.slice(-8)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.shippingAddress?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress?.phone || ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.items?.length || 0} bidhaa</td>
                    <td className="px-4 py-3 font-bold">KSh {(order.total || 0).toLocaleString()}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
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
                    <td className="px-4 py-3 text-gray-400">
                      {expandedOrder === order._id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                        
                        {/* Customer & Shipping Info */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Maelezo ya Mteja
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p className="font-medium text-gray-900">
                                {order.shippingAddress?.name || 'Jina haipo'}
                              </p>
                              <p className="flex items-center gap-1 text-gray-600">
                                <Phone className="h-3 w-3" />
                                {order.shippingAddress?.phone || 'Simu haipo'}
                              </p>
                              {order.customerEmail && (
                                <p className="flex items-center gap-1 text-gray-600">
                                  <Mail className="h-3 w-3" />
                                  {order.customerEmail}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Anwani ya Uwasilishaji
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-800">
                                {order.shippingAddress?.address || 'Anwani haipo'}
                              </p>
                              <p className="text-gray-600">
                                {[order.shippingAddress?.city, order.shippingAddress?.region]
                                  .filter(Boolean)
                                  .join(', ') || 'Mji haipo'}
                              </p>
                              {order.shippingAddress?.notes && (
                                <p className="text-gray-500 text-xs mt-1 italic">
                                  Maelezo: {order.shippingAddress.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Products Ordered */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <h3 className="font-semibold text-sm text-gray-700 p-3 border-b bg-gray-50 flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            Bidhaa Zilizoagizwa ({order.items?.length || 0})
                          </h3>
                          
                          {(!order.items || order.items.length === 0) ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Hakuna bidhaa zilizoonyeshwa
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="p-3 flex items-center gap-3 hover:bg-gray-50">
                                  <img 
                                    src={item.image || 'https://via.placeholder.com/48?text=No+Image'} 
                                    alt={item.name || 'Bidhaa'}
                                    className="h-12 w-12 object-cover rounded-lg"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+Image'; }}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <div>
                                        <p className="font-medium text-gray-900 text-sm">
                                          {item.name || 'Jina halipo'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                          Kiasi: {item.quantity || 0} × KSh {item.price?.toLocaleString() || 0}
                                        </p>
                                        {item.categoryName && (
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            Kategoria: {item.categoryName}
                                          </p>
                                        )}
                                      </div>
                                      <p className="font-semibold text-emerald-600 text-sm">
                                        KSh {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Order Summary */}
                          <div className="p-3 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Jumla ya Bidhaa:</span>
                              <span className="font-medium">
                                KSh {(order.subtotal || order.total || 0).toLocaleString()}
                              </span>
                            </div>
                            {order.shipping > 0 && (
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Gharama ya Usafirishaji:</span>
                                <span className="font-medium">
                                  KSh {order.shipping.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {order.tax > 0 && (
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Kodi:</span>
                                <span className="font-medium">
                                  KSh {order.tax.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200">
                              <span>Jumla Kuu:</span>
                              <span className="text-emerald-600">
                                KSh {(order.total || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          {order.shippingAddress?.phone && (
                            <button 
                              onClick={() => window.open(
                                `https://wa.me/${order.shippingAddress.phone.replace(/[^0-9]/g, '')}?text=Habari%20${encodeURIComponent(order.shippingAddress.name || '')}%2C%20Agizo%20lenu%20la%20SmartNest%20linachakatwa.`,
                                '_blank'
                              )}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <Phone className="h-4 w-4" />
                              Wasiliana kwa WhatsApp
                            </button>
                          )}
                        </div>

                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}