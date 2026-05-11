import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import toast from 'react-hot-toast';

export default function FavoriteButton({ productId, product, className = '', size = 'h-5 w-5' }) {
  const { isFavorite, toggleFavorite, isInitialized } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get product data if not provided (for guests who need product info)
  const productData = useQuery(api.products.getById, 
    !product && productId ? { id: productId } : 'skip'
  );
  
  const currentProduct = product || productData;
  const isFav = isFavorite(productId);
  
  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Now works for both guests AND logged-in users!
    // The FavoritesContext handles localStorage for guests and server for logged-in users
    await toggleFavorite(productId, currentProduct);
    
    setIsLoading(false);
  };
  
  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <button 
        className={`p-2 rounded-full bg-gray-100 text-gray-400 cursor-wait ${className}`} 
        disabled
      >
        <Heart className={`${size}`} />
      </button>
    );
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFav 
          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500'
      } ${className}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`${size} transition-all ${isFav ? 'fill-current' : ''}`} 
      />
    </button>
  );
}