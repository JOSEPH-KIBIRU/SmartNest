import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function AnimatedSection({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up' // up, down, left, right
}) {
  const { ref, isVisible } = useScrollAnimation();

  const directionStyles = {
    up: 'translate-y-16',
    down: '-translate-y-16',
    left: 'translate-x-16',
    right: '-translate-x-16'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0' 
          : `opacity-0 ${directionStyles[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}