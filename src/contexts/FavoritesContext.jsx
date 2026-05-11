import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext(null);

// Local storage key
const FAVORITES_STORAGE_KEY = 'smartnest_favorites';

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user, auth0User } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get user data from Convex
  const userData = useQuery(api.auth.getUser, 
    isAuthenticated && auth0User?.sub ? { auth0Id: auth0User.sub } : 'skip'
  );
  
  // Convex mutations
  const addFavoriteMutation = useMutation(api.favorites.addFavorite);
  const removeFavoriteMutation = useMutation(api.favorites.removeFavorite);
  const syncFavoritesMutation = useMutation(api.favorites.syncFavorites);
  
  // Get favorites from Convex (for logged-in users)
  const serverFavorites = useQuery(api.favorites.getFavorites,
    isAuthenticated && userData?._id ? { userId: userData._id } : 'skip'
  );

  // Load favorites from localStorage on initial load (for guests)
  useEffect(() => {
    const loadLocalFavorites = () => {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites(parsed);
          const ids = new Set(parsed.map(f => f.productId));
          setFavoriteIds(ids);
        } catch (e) {
          console.error('Error loading favorites from localStorage:', e);
        }
      }
    };
    
    loadLocalFavorites();
    setIsInitialized(true);
  }, []);

  // Sync local favorites to server when user logs in
  useEffect(() => {
    const syncToServer = async () => {
      if (isAuthenticated && userData?._id && favorites.length > 0) {
        try {
          // Get local favorites
          const localFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
          
          if (localFavorites.length > 0) {
            // Sync to server
            await syncFavoritesMutation({
              userId: userData._id,
              productIds: localFavorites.map(f => f.productId)
            });
            
            // Clear local storage after sync
            localStorage.removeItem(FAVORITES_STORAGE_KEY);
            console.log('Favorites synced to server');
          }
        } catch (error) {
          console.error('Error syncing favorites:', error);
        }
      }
    };
    
    syncToServer();
  }, [isAuthenticated, userData?._id]);

  // Update state when server favorites load (for logged-in users)
  useEffect(() => {
    if (serverFavorites && isAuthenticated) {
      setFavorites(serverFavorites);
      const ids = new Set(serverFavorites.map(f => f.productId));
      setFavoriteIds(ids);
    }
  }, [serverFavorites, isAuthenticated]);

  // Save favorites to localStorage for guests
  const saveToLocalStorage = (updatedFavorites) => {
    if (!isAuthenticated) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    }
  };

  const addFavorite = async (productId, productData = null) => {
    // For guests - save to localStorage
    if (!isAuthenticated) {
      // Check if already exists
      if (favoriteIds.has(productId)) {
        toast.success('Tayari iko kwenye favoriti!');
        return false;
      }
      
      const newFavorite = {
        productId,
        addedAt: Date.now(),
        product: productData
      };
      
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      setFavoriteIds(new Set([...favoriteIds, productId]));
      saveToLocalStorage(updatedFavorites);
      toast.success('Imeongezwa kwenye favoriti!');
      return true;
    }
    
    // For logged-in users - save to server
    if (!userData?._id) {
      toast.error('Tafadhali subiri...');
      return false;
    }
    
    try {
      const result = await addFavoriteMutation({
        userId: userData._id,
        productId,
      });
      
      if (result.success) {
        toast.success('Imeongezwa kwenye favoriti!');
        return true;
      } else if (result.message === 'Already in favorites') {
        toast.success('Tayari iko kwenye favoriti!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Imeshindwa kuongeza kwenye favoriti');
      return false;
    }
  };
  
  const removeFavorite = async (productId) => {
    // For guests - remove from localStorage
    if (!isAuthenticated) {
      const updatedFavorites = favorites.filter(f => f.productId !== productId);
      setFavorites(updatedFavorites);
      const newIds = new Set(updatedFavorites.map(f => f.productId));
      setFavoriteIds(newIds);
      saveToLocalStorage(updatedFavorites);
      toast.success('Imeondolewa kwenye favoriti');
      return true;
    }
    
    // For logged-in users - remove from server
    if (!userData?._id) return false;
    
    try {
      const result = await removeFavoriteMutation({
        userId: userData._id,
        productId,
      });
      
      if (result.success) {
        toast.success('Imeondolewa kwenye favoriti');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Imeshindwa kuondoa kwenye favoriti');
      return false;
    }
  };
  
  const toggleFavorite = async (productId, productData = null) => {
    if (favoriteIds.has(productId)) {
      return await removeFavorite(productId);
    } else {
      return await addFavorite(productId, productData);
    }
  };
  
  const isFavorite = (productId) => {
    return favoriteIds.has(productId);
  };
  
  const value = {
    favorites,
    favoriteIds,
    favoriteCount: favorites.length,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    isInitialized,
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};