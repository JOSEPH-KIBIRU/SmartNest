import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCart } from '../contexts/CartContext';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Minus, 
  Plus, 
  MessageCircle,
  Share2,
  Copy,
  Check,
  Truck,
  Smartphone,
  Building2,
  ThumbsUp
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useQuery(api.products.getById, { id });
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [added, setAdded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><div className="animate-pulse h-96 bg-gray-200 rounded-xl" /></div>;

  const handleAdd = () => {
    addToCart(product, qty, selectedAttrs);
    setAdded(true);
    toast.success('Imeongezwa kwenye kikapu!');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = '254700000000';
    const message = `Hi SmartNest! I'm interested in ${product.name} - KSh ${product.price.toLocaleString()}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareUrl = window.location.href;
  const shareText = `${product.name} - KSh ${product.price.toLocaleString()} kutoka SmartNest`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link imenakiliwa!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Imeshindwa kunakili link');
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    const ratingValue = interactive ? (hoverRating || userRating) : rating;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          onClick={() => interactive && setUserRating(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`h-5 w-5 ${interactive ? 'cursor-pointer' : ''} ${
            i <= ratingValue ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          } transition-colors`}
        />
      );
    }
    return stars;
  };

  const trustIndicators = [
    { icon: Truck, title: 'Uwasilishaji Haraka', description: '24-48 hrs Nairobi', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Smartphone, title: 'Lipa M-Pesa', description: 'Tuma kwa 0738119756', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Building2, title: 'Cash on Delivery', description: 'Lipa ukipokea', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: MessageCircle, title: 'WhatsApp Support', description: '0738119756', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />
      
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Rudi
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden sticky top-24">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {renderStars(product.rating || 0)}
                <span className="ml-2 text-sm text-gray-600">({product.reviewCount || 0} maoni)</span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">98% wanapendekeza</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100">
            {trustIndicators.map((indicator, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${indicator.bg}`}>
                <indicator.icon className={`h-5 w-5 ${indicator.color}`} />
                <div>
                  <p className={`text-sm font-semibold ${indicator.color}`}>{indicator.title}</p>
                  <p className="text-xs text-gray-600">{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Kiasi:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-gray-100">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.inventory, qty + 1))} className="p-2 hover:bg-gray-100">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className={`text-sm ${product.inventory < 10 ? 'text-red-600' : 'text-gray-500'}`}>
              {product.inventory} zimebaki
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleWhatsAppInquiry}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-5 w-5" />
              Uliza kwa WhatsApp
            </button>
            
            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Share2 className="h-5 w-5" />
                Shiriki
              </button>
              
              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={copyToClipboard}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-gray-500" />}
                        <span className="text-sm">Copy Link</span>
                      </button>
                      
                      <button
                        onClick={() => window.open(shareLinks.facebook, '_blank')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="h-5 w-5 flex items-center justify-center text-blue-600 font-bold text-lg">f</span>
                        <span className="text-sm">Share on Facebook</span>
                      </button>
                      
                      <button
                        onClick={() => window.open(shareLinks.twitter, '_blank')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="h-5 w-5 flex items-center justify-center text-sky-500 text-lg">𝕏</span>
                        <span className="text-sm">Share on Twitter</span>
                      </button>
                      
                      <button
                        onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Share on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={handleAdd} 
            disabled={product.inventory === 0 || added}
            className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold text-lg transition-colors ${
              added ? 'bg-green-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {added ? (
              <>✅ Imeongezwa</>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ongeza kwenye Kikapu
              </>
            )}
          </button>

          {/* Rate this product */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Tathmini bidhaa hii:</span>
              <div className="flex items-center">
                {renderStars(product.rating || 0, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}