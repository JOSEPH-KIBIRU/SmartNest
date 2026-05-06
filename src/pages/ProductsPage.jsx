import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ProductCard from '../components/product/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const products = useQuery(api.products.getAll, { isActive: true, limit: 100 });
  const [priceRange, setPriceRange] = useState(500000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products?.filter(p => p.price <= priceRange) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bidhaa Zote</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 md:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> Chuja
        </button>
      </div>
      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold mb-4">Kiwango cha Bei</h3>
            <input type="range" min="0" max="500000" value={priceRange} onChange={e => setPriceRange(parseInt(e.target.value))} className="w-full accent-emerald-600" />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>KSh 0</span><span>KSh {priceRange.toLocaleString()}</span>
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Hakuna bidhaa zinazolingana na vigezo vyako.</div>}
        </div>
      </div>
    </div>
  );
}