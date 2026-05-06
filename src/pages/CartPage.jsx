import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, LogIn } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kikapu chako ni tupu</h2>
        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
          Anza Kununua <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Kikapu Chako</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div key={`${item.productId}-${idx}`} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-200">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {Object.entries(item.selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </p>
                )}
                <p className="text-emerald-600 font-bold mt-1">KSh {item.price.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.selectedAttributes, item.quantity - 1)} 
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.selectedAttributes, item.quantity + 1)} 
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId, item.selectedAttributes)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Muhtasari wa Malipo</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Kiasi</span>
                <span>KSh {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Usafiri</span>
                <span className="text-emerald-600">Bure</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Jumla</span>
                <span>KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Checkout button - always available */}
            <Link 
              to="/checkout" 
              className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
            >
              Endelea kwa Malipo
            </Link>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Unaweza kulipa kama mgeni au{' '}
              <Link to="/login" className="text-emerald-600 hover:underline">
                ingia
              </Link>{' '}
              kuokoa maagizo yako
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}