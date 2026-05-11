import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { favorites, removeFavorite, favoriteCount, isInitialized } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1, {});
    toast.success('Imeongezwa kwenye kikapu!');
  };
  
  const handleRemove = async (productId, e) => {
    e.stopPropagation();
    await removeFavorite(productId);
  };
  
  if (!isInitialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Orodha ya Favoriti Iko Tupu</h2>
        <p className="text-gray-600 mb-6">
          {isAuthenticated 
            ? 'Bado hujaongeza bidhaa zozote kwenye favoriti zako'
            : 'Ingia au ongeza bidhaa kwenye favoriti bila kuingia'}
        </p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
        >
          Anza Kununua
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Favoriti Zangu</h1>
          <p className="text-gray-600 mt-1">
            Una bidhaa {favoriteCount} kwenye orodha yako
            {!isAuthenticated && ' (Zimehifadhiwa kwenye kivinjari chako)'}
          </p>
        </div>
        <Link 
          to="/products" 
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          Ongeza Zaidi
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      {!isAuthenticated && favorites.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          💡 Vidokezo: Favoriti zako zimehifadhiwa kwenye kivinjari chako.
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <div key={item.productId} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* Remove button */}
            <button
              onClick={(e) => handleRemove(item.productId, e)}
              className="absolute top-2 right-2 z-10 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <Link to={`/product/${item.product?.slug || item.productId}`}>
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={item.product?.images?.[0] || '/placeholder.jpg'} 
                  alt={item.product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/product/${item.product?.slug || item.productId}`}>
                <h3 className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-2">
                  {item.product?.name || 'Bidhaa'}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.product?.description}
              </p>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  KSh {item.product?.price?.toLocaleString() || 0}
                </span>
                
                <button
                  onClick={(e) => handleAddToCart(item.product, e)}
                  disabled={item.product?.inventory === 0}
                  className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}