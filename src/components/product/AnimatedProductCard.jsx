import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ProductCard from './ProductCard';

export default function AnimatedProductCard({ product, index = 0 }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-16 scale-95'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <ProductCard product={product} />
    </div>
  );
}