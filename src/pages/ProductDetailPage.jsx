import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCart } from '../contexts/CartContext';
import { Star, ShoppingCart, ArrowLeft, Minus, Plus, MessageCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useQuery(api.products.getById, { id });
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [added, setAdded] = useState(false);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><div className="animate-pulse h-96 bg-gray-200 rounded-xl" /></div>;

  const handleAdd = () => {
    addToCart(product, qty, selectedAttrs);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // WhatsApp inquiry function
  const handleWhatsAppInquiry = () => {
    const phoneNumber = '254738119756'; 
    const message = `Hi SmartNest! I'm interested in this product:

📦 *Product:* ${product.name}
💰 *Price:* KSh ${product.price.toLocaleString()}
🔢 *Quantity:* ${qty}
${selectedAttrs.size ? `📏 *Size:* ${selectedAttrs.size}` : ''}

Can you please give me more information about availability and delivery?`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderAttrs = () => {
    if (!product.attributes) return null;
    return Object.entries(product.attributes).map(([key, value]) => {
      if (key === 'sizes' && Array.isArray(value)) {
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ukubwa</label>
            <div className="flex flex-wrap gap-2">
              {value.map(size => (
                <button key={size} onClick={() => setSelectedAttrs(prev => ({ ...prev, size }))}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${selectedAttrs.size === size ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-300 hover:border-gray-400'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Rudi
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /><span className="ml-1 font-medium">{product.rating || 0}</span></div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.reviewCount || 0} maoni</span>
            </div>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
            {product.compareAtPrice && <span className="text-xl text-gray-400 line-through">KSh {product.compareAtPrice.toLocaleString()}</span>}
          </div>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          {renderAttrs()}
          
          {/* WhatsApp Inquiry Button - ADDED HERE */}
          <div className="flex gap-3">
            <button 
              onClick={handleWhatsAppInquiry}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-colors bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Uliza kwa WhatsApp
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Kiasi:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-gray-100"><Minus className="h-4 w-4" /></button>
              <span className="px-4 font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.inventory, qty + 1))} className="p-2 hover:bg-gray-100"><Plus className="h-4 w-4" /></button>
            </div>
            <span className={`text-sm ${product.inventory < 10 ? 'text-red-600' : 'text-gray-500'}`}>{product.inventory} zimebaki</span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAdd} 
            disabled={product.inventory === 0 || added}
            className={`flex items-center justify-center px-6 py-4 rounded-xl font-bold text-lg transition-colors w-full md:w-auto ${
              added 
                ? 'bg-green-600 text-white' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300'
            }`}
          >
            {added ? (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Imeongezwa
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ongeza kwenye Kikapu
              </>
            )}
          </button>
          
          {product.attributes && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Vigezo vya Bidhaa</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.attributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600 capitalize">{k}</dt>
                    <dd className="font-medium text-gray-900">{Array.isArray(v) ? v.join(', ') : v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}