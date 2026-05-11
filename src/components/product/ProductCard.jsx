import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import FavoriteButton from "../common/FavoriteButton";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, {});
    toast.success("Imeongezwa kwenye kikapu!");
  };

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Favorite Button */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton productId={product._id} product={product} />
      </div>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <Link to={`/product/${product.slug || product._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              KSh {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                KSh {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Stock indicator */}
        {product.inventory > 0 && product.inventory < 10 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {product.inventory} left
          </p>
        )}
      </div>
    </div>
  );
}
