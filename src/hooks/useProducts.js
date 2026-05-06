import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useProducts(options = {}) {
  const { categoryId, limit = 100, isActive = true } = options;
  
  return useQuery(api.products.getAll, {
    categoryId,
    limit,
    isActive
  });
}

export function useProduct(id) {
  return useQuery(api.products.getById, { id });
}

export function useSearchProducts(query) {
  return useQuery(api.products.search, query ? { query } : 'skip');
}