import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isLowStock = product.inventory <= (product.lowStockThreshold || 5);

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`} className="block relative">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img src={product.images[0] || '/placeholder.jpg'} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          {isLowStock && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Stock Chache</span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center space-x-1 mb-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm text-gray-600">{product.rating || 0} ({product.reviewCount || 0})</span>
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">KSh {product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
          <button onClick={handleAdd} disabled={product.inventory === 0}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Ongeza kwenye kikapu">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}