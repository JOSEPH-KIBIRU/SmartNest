import React from 'react';
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
  Warehouse
} from 'lucide-react';

export default function DashboardPage() {
  const { isAdmin, isLoading } = useAuth();
  const products = useQuery(api.products.getAll, { limit: 200 });
  const orders = useQuery(api.orders.getAll);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );
  
  if (!isAdmin) return <Navigate to="/" replace />;

  const lowStock = products?.filter(p => p.inventory <= (p.lowStockThreshold || 5)) || [];
  const totalRevenue = orders?.reduce((a, o) => a + o.total, 0) || 0;

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
      title: 'Stock Chache',
      value: lowStock.length,
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/inventory'
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

      {/* Recent Low Stock */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Bidhaa Zilizokaribia Kuisha
            </h2>
            <Link to="/admin/inventory" className="text-sm text-emerald-600 hover:text-emerald-700">
              Angalia Zote
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStock.slice(0, 5).map(product => (
              <div key={product._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img src={product.images[0]} alt={product.name} className="h-10 w-10 object-cover rounded" />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">Stock: {product.inventory}</p>
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