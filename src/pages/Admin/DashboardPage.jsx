import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Loader2,
  Grid3X3,
  ClipboardList,
  Warehouse,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const { isAdmin, isLoading } = useAuth();
  const products = useQuery(api.products.getAll, { limit: 200 });
  const orders = useQuery(api.orders.getAll);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );
  
  if (!isAdmin) return <Navigate to="/" replace />;

  const lowStock = products?.filter(p => p.inventory <= (p.lowStockThreshold || 5)) || [];
  const totalRevenue = orders?.reduce((a, o) => a + (o.total || 0), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending') || [];
  
  // Filter orders by status
  const filteredOrders = orders?.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  }) || [];

  // Status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Inasubiri' },
      paid: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Imelipwa' },
      processing: { color: 'bg-purple-100 text-purple-800', icon: Truck, text: 'Inachakatwa' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, text: 'Imetumwa' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Imefika' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Imefutwa' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  const statCards = [
    {
      title: 'Jumla ya Bidhaa',
      value: products?.length || 0,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/products'
    },
    {
      title: 'Maagizo Yote',
      value: orders?.length || 0,
      icon: ShoppingCart,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/admin/orders'
    },
    {
      title: 'Maagizo Yanayosubiri',
      value: pendingOrders.length,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      link: '/admin/orders'
    },
    {
      title: 'Jumla ya Mauzo',
      value: `KSh ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/orders'
    }
  ];

  const quickLinks = [
    {
      title: 'Simamia Bidhaa',
      description: 'Ongeza, hariri, au futa bidhaa',
      icon: Grid3X3,
      link: '/admin/products',
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      title: 'Simamia Maagizo',
      description: 'Angalia na sasisha hali za maagizo',
      icon: ClipboardList,
      link: '/admin/orders',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Hesabu za Stock',
      description: 'Fuatilia stock na bidhaa zilizokaribia kuisha',
      icon: Warehouse,
      link: '/admin/inventory',
      color: 'bg-amber-600 hover:bg-amber-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashibodi ya Msimamizi</h1>
        <p className="text-gray-600 mt-2">Karibu, SmartNest Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            to={stat.link}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <span>Angalia zaidi</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vitendo vya Haraka</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.link}
            className={`${link.color} text-white p-6 rounded-xl transition-colors flex items-start space-x-4`}
          >
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <link.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{link.title}</h3>
              <p className="text-sm text-white text-opacity-90 mt-1">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-emerald-600" />
            Maagizo ya Wateja
          </h2>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterStatus === status 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status === 'all' ? 'Zote' : status}
              </button>
            ))}
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Hakuna maagizo</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div key={order._id} className="hover:bg-gray-50 transition-colors">
                {/* Order Header */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900">
                            Order #{order._id.slice(-8)}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('sw-KE')}
                          </span>
                          <span className="font-medium text-emerald-600">
                            KSh {order.total?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {order.items?.length || 0} bidhaa
                      </span>
                      {expandedOrder === order._id ? 
                        <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details - SHOWS PRODUCTS */}
                {expandedOrder === order._id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                    {/* Customer Information */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Maelezo ya Mteja
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-gray-900">{order.shippingAddress?.name || 'Jina haipo'}</p>
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
                          <p className="text-gray-800">{order.shippingAddress?.address || 'Anwani haipo'}</p>
                          <p className="text-gray-600">
                            {[order.shippingAddress?.city, order.shippingAddress?.region].filter(Boolean).join(', ') || 'Mji haipo'}
                          </p>
                          {order.shippingAddress?.notes && (
                            <p className="text-gray-500 text-xs mt-1 italic">Maelezo: {order.shippingAddress.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Products Ordered - THIS IS WHERE PRODUCTS ARE DISPLAYED */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <h3 className="font-semibold text-sm text-gray-700 p-3 border-b bg-gray-50 flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        Bidhaa Zilizoagizwa ({order.items?.length || 0})
                      </h3>
                      <div className="divide-y divide-gray-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center gap-3 hover:bg-gray-50">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded-lg"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=No+Image'}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Kiasi: {item.quantity} × KSh {item.price?.toLocaleString()}
                                  </p>
                                  {item.categoryName && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Kategoria: {item.categoryName}
                                    </p>
                                  )}
                                </div>
                                <p className="font-semibold text-emerald-600 text-sm">
                                  KSh {(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Order Summary */}
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Jumla ya Bidhaa:</span>
                          <span className="font-medium">KSh {(order.subtotal || order.total).toLocaleString()}</span>
                        </div>
                        {order.shipping > 0 && (
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Gharama ya Usafirishaji:</span>
                            <span className="font-medium">KSh {order.shipping.toLocaleString()}</span>
                          </div>
                        )}
                        {order.tax > 0 && (
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Kodi:</span>
                            <span className="font-medium">KSh {order.tax.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200">
                          <span>Jumla Kuu:</span>
                          <span className="text-emerald-600">KSh {order.total?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Link 
                        to={`/admin/orders`}
                        className="flex-1 text-center px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Sasisha Hali ya Agizo
                      </Link>
                      {order.shippingAddress?.phone && (
                        <button 
                          onClick={() => window.open(`https://wa.me/${order.shippingAddress.phone.replace(/[^0-9]/g, '')}?text=Habari%20${encodeURIComponent(order.shippingAddress.name)}%2C%20Agizo%20lenu%20la%20SmartNest%20linachakatwa.`, '_blank')}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          Wasiliana
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-red-50">
            <h2 className="text-lg font-semibold text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Bidhaa Zilizokaribia Kuisha ({lowStock.length})
            </h2>
            <Link to="/admin/inventory" className="text-sm text-emerald-600 hover:text-emerald-700">
              Angalia Zote
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {lowStock.slice(0, 10).map(product => (
              <div key={product._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img src={product.images?.[0]} alt={product.name} className="h-10 w-10 object-cover rounded" />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">Stock: {product.inventory} zimebaki</p>
                  </div>
                </div>
                <Link 
                  to={`/admin/products`}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Rekebisha
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}