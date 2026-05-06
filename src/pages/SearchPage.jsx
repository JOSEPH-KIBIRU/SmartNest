import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ProductCard from '../components/product/ProductCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const results = useQuery(api.products.search, { query });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <Search className="mr-2 h-6 w-6" /> Matokeo ya "{query}"
      </h1>
      <p className="text-gray-600 mb-6">{results?.length || 0} bidhaa zimepatikana</p>
      {results && results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16"><p className="text-gray-500 text-lg">Hakuna bidhaa zinazolingana na "{query}"</p></div>
      )}
    </div>
  );
} 