import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CreditCard, MapPin, Phone, User, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import SavedShippingDetails from '../components/checkout/SavedShippingDetails';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user, auth0User, login } = useAuth();
  const createOrder = useMutation(api.orders.create);
  const navigate = useNavigate();
  
  // Get user data including saved shipping
  const userData = useQuery(api.auth.getUser, 
    isAuthenticated && auth0User?.sub ? { auth0Id: auth0User.sub } : 'skip'
  );
  
  const [form, setForm] = useState({ 
    name: user?.name || userData?.name || '', 
    phone: userData?.phone || '', 
    address: userData?.address || '', 
    city: userData?.city || '', 
    region: userData?.region || '', 
    email: user?.email || userData?.email || '',
    notes: '' 
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill form when userData loads
  useEffect(() => {
    if (userData && isAuthenticated) {
      setForm(prev => ({
        ...prev,
        name: prev.name || userData.name || '',
        phone: prev.phone || userData.phone || '',
        address: prev.address || userData.address || '',
        city: prev.city || userData.city || '',
        region: prev.region || userData.region || '',
        email: prev.email || userData.email || '',
      }));
    }
  }, [userData, isAuthenticated]);

  const updateFormData = (newData) => {
    setForm(prev => ({ ...prev, ...newData }));
  };

  // Calculate shipping and tax
  const calculateShipping = (subtotal) => {
    return subtotal > 5000 ? 0 : 299;
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.16;
  };

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

  const subtotal = totalPrice;
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const grandTotal = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true); 
    setError('');
    
    try {
      // Validate required fields
      if (!form.name || !form.phone || !form.address || !form.city || !form.region) {
        toast.error('Tafadhali jaza sehemu zote zenye alama ya nyota (*)');
        setProcessing(false);
        return;
      }
      
      const userId = user?._id || userData?._id || `guest_${Date.now()}`;
      const customerEmail = form.email || user?.email || userData?.email || `${form.phone}@guest.smartnest.com`;
      
      const orderId = await createOrder({
        userId: userId,
        items: cart.map(i => ({ 
          productId: i.productId, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity, 
          image: i.image, 
          attributes: i.selectedAttributes || {}
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: grandTotal,
        customerEmail: customerEmail,
        shippingAddress: { 
          name: form.name, 
          phone: form.phone, 
          address: form.address, 
          city: form.city, 
          region: form.region, 
          notes: form.notes || '' 
        },
      });
      
      clearCart();
      toast.success('Agizo limefanikiwa!');
      navigate('/order-success', { state: { orderId } });
    } catch (err) {
      console.error('Order creation error:', err);
      toast.error(err.message || 'Kulikuwa na hitilafu. Tafadhali jaribu tena.');
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
            <p className="text-blue-800 font-medium">Unaununua kama mgeni</p>
            <p className="text-blue-600 text-sm mt-1">
              Ingia ili kuhifadhi anwani yako kwa ajili ya ununuzi ujao.
              <button onClick={login} className="underline font-medium ml-1 hover:text-blue-800">
                Ingia hapa
              </button>
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
          {/* Saved Shipping Details Component */}
          {isAuthenticated && (
            <SavedShippingDetails 
              formData={form}
              updateFormData={updateFormData}
            />
          )}
          
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
                  placeholder="Maelezo ya ziada kuhusu usafiri (mfano: wito kabla ya kufika)..." 
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
            {processing ? 'Inachakata...' : `Lipa KSh ${grandTotal.toLocaleString()}`}
          </button>
        </form>
        
        {/* Order Summary - same as before */}
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
              
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jumla ya Bidhaa:</span>
                  <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usafirishaji:</span>
                  <span className="font-medium">{shipping === 0 ? 'Bure' : `KSh ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kodi (16% VAT):</span>
                  <span className="font-medium">KSh {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-lg font-bold border-t border-gray-200">
                  <span>Jumla Kuu:</span>
                  <span className="text-emerald-600">KSh {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}