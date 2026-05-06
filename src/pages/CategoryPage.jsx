import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ProductCard from '../components/product/ProductCard';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = useQuery(api.categories.getBySlug, { slug });
  const all = useQuery(api.products.getAll, { isActive: true, limit: 100 });
  const products = all?.filter(p => p.categoryId === category?._id) || [];

  if (!category) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.nameSwahili}</h1>
        <p className="text-gray-600 mt-2">{category.description}</p>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200"><p className="text-gray-500">Hakuna bidhaa katika kategoria hii kwa sasa.</p></div>
      )}
    </div>
  );
}