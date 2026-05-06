import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Package, TrendingDown, Loader2, Plus, Minus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function InventoryPage() {
  const { isAdmin, isLoading } = useAuth();
  const products = useQuery(api.products.getAll, { limit: 200 });
  const updateInventory = useMutation(api.products.updateInventory);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  if (isLoading) return <div className="p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const lowStock = products?.filter(p => p.inventory <= (p.lowStockThreshold || 5)) || [];
  const outOfStock = products?.filter(p => p.inventory === 0) || [];

  const handleAdjust = async (productId, currentInventory) => {
    const amount = parseInt(adjustAmount);
    if (isNaN(amount)) return;
    
    await updateInventory({ id: productId, inventory: Math.max(0, currentInventory + amount) });
    setAdjustingProduct(null);
    setAdjustAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Hesabu za Stock</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jumla ya Bidhaa</p>
              <p className="text-2xl font-bold text-gray-900">{products?.length || 0}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Chache</p>
              <p className="text-2xl font-bold text-amber-600">{lowStock.length}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Zimeisha</p>
              <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-red-600 flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" /> Bidhaa Zilizokaribia Kuisha
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map(p => (
              <div key={p._id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-sm text-red-600 mt-1">Stock: {p.inventory}</p>
                  </div>
                  <button 
                    onClick={() => setAdjustingProduct(p)}
                    className="p-2 bg-white border border-red-300 rounded-lg hover:bg-red-100"
                  >
                    <Plus className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Orodha ya Stock Zote</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Bidhaa</th>
                <th className="px-4 py-3">Stock Sasa</th>
                <th className="px-4 py-3">Kiwango cha Chini</th>
                <th className="px-4 py-3">Hali</th>
                <th className="px-4 py-3">Rekebisha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${p.inventory === 0 ? 'text-red-600' : p.inventory <= (p.lowStockThreshold || 5) ? 'text-amber-600' : 'text-gray-900'}`}>
                      {p.inventory}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.lowStockThreshold || 5}</td>
                  <td className="px-4 py-3">
                    {p.inventory === 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Imeisha</span>
                    ) : p.inventory <= (p.lowStockThreshold || 5) ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">Chache</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Njema</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {adjustingProduct?._id === p._id ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={adjustAmount} 
                          onChange={e => setAdjustAmount(e.target.value)}
                          placeholder="Ongeza/Punguza"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          autoFocus
                        />
                        <button onClick={() => handleAdjust(p._id, p.inventory)} className="p-1 bg-emerald-100 text-emerald-700 rounded">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setAdjustingProduct(null); setAdjustAmount(''); }} className="p-1 bg-gray-100 text-gray-700 rounded">
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setAdjustingProduct(p)}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Rekebisha
                      </button>
                    )}
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

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}