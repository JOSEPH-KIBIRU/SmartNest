import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CreditCard, MapPin, Phone, User, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user, login } = useAuth();
  const createOrder = useMutation(api.orders.create);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    phone: '', 
    address: '', 
    city: '', 
    region: '', 
    email: user?.email || '',
    notes: '' 
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Kikapu chako ni tupu</h2>
        <Link to="/products" className="text-emerald-600 font-medium hover:underline">
          Endelea kununua
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true); 
    setError('');
    
    try {
      // Generate a guest user ID if not logged in
      const userId = user?._id || `guest_${Date.now()}`;
      
      const orderId = await createOrder({
        userId: userId,
        items: cart.map(i => ({ 
          productId: i.productId, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity, 
          image: i.image, 
          attributes: i.selectedAttributes 
        })),
        total: totalPrice,
        shippingAddress: { 
          name: form.name, 
          phone: form.phone, 
          address: form.address, 
          city: form.city, 
          region: form.region, 
          notes: form.notes 
        },
      });
      
      clearCart();
      navigate('/order-success', { state: { orderId } });
    } catch (err) {
      setError('Kulikuwa na hitilafu. Tafadhali jaribu tena.');
    } finally { 
      setProcessing(false); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Malipo</h1>
      
      {/* Guest checkout notice */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <LogIn className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium">Unanunua kama mgeni</p>
            <p className="text-blue-600 text-sm mt-1">
              Unaweza kuendelea bila kuingia. 
              <button onClick={login} className="underline font-medium ml-1 hover:text-blue-800">
                Ingia hapa
              </button> 
              ikiwa unataka kuokoa maagizo yako.
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-emerald-600" /> 
              Anwani ya Usafiri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jina Kamili *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input 
                    required 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Simu *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input 
                    required 
                    type="tel" 
                    value={form.phone} 
                    onChange={e => setForm({...form, phone: e.target.value})} 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="+254 712 345 678" 
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Barua pepe</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                  placeholder="john@example.com" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Anwani *</label>
                <input 
                  required 
                  type="text" 
                  value={form.address} 
                  onChange={e => setForm({...form, address: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Mtaa, Nyumba Namba" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jiji *</label>
                <input 
                  required 
                  type="text" 
                  value={form.city} 
                  onChange={e => setForm({...form, city: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Nairobi" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kaunti *</label>
                <input 
                  required 
                  type="text" 
                  value={form.region} 
                  onChange={e => setForm({...form, region: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Nairobi County" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Maelezo Zaidi</label>
                <textarea 
                  value={form.notes} 
                  onChange={e => setForm({...form, notes: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                  rows={3} 
                  placeholder="Maelezo ya ziada kuhusu usafiri..." 
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={processing} 
            className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
          >
            <CreditCard className="mr-2 h-5 w-5" /> 
            {processing ? 'Inachakata...' : `Lipa KSh ${totalPrice.toLocaleString()}`}
          </button>
        </form>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Muhtasari wa Agizo</h2>
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 text-lg font-bold">
                <span>Jumla</span>
                <span>KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}