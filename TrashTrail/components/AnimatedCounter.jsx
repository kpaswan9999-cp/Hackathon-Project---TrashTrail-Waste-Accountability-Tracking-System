'use client';

import { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ target, suffix = '', duration = 2000, label, icon }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const startValue = 0;
    const endValue = parseFloat(target) || 0;
    const isFloat = !Number.isInteger(endValue);

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = startValue + (endValue - startValue) * easeProgress;

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animation);
  }, [target, duration, isVisible]);

  // Format to standard comma separation and handle decimal places conditionally
  const formattedCount = Number.isInteger(Number(target)) 
    ? Math.round(count).toLocaleString() 
    : count.toFixed(1).toLocaleString();

  return (
    <div ref={containerRef} className="text-center flex flex-col items-center justify-center p-4">
      {icon && <div className="text-4xl mb-3 animate-float drop-shadow-2xl">{icon}</div>}
      <div className="flex items-baseline justify-center gap-1">
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
          {formattedCount}
        </h2>
        {suffix && <span className="text-3xl font-bold text-emerald-400">{suffix}</span>}
      </div>
      <p className="text-xs sm:text-sm font-bold text-gray-400 mt-3 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}
