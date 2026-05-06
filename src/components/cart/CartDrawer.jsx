import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { isOpen, setIsOpen, cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> Kikapu Chako ({cart.length})
            </h2>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Kikapu chako ni tupu</p>
                <button onClick={() => setIsOpen(false)} className="mt-4 text-emerald-600 font-medium hover:text-emerald-700">Endelea Kununua</button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                    {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Object.entries(item.selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateQuantity(item.productId, item.selectedAttributes, item.quantity - 1)}
                          className="p-1 rounded bg-white border border-gray-300 hover:bg-gray-100"><Minus className="h-3 w-3" /></button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.selectedAttributes, item.quantity + 1)}
                          className="p-1 rounded bg-white border border-gray-300 hover:bg-gray-100"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-sm">KSh {(item.price * item.quantity).toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item.productId, item.selectedAttributes)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Jumla</span><span>KSh {totalPrice.toLocaleString()}</span>
              </div>
              <Link to="/checkout" onClick={() => setIsOpen(false)}
                className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Endelea kwa Malipo
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}