import { useState, useEffect } from 'react';

export function computeAdaptivePageSize(width: number, viewMode: 'grid' | 'list'): number {
  if (viewMode === 'list') {
    if (width < 640) return 6;
    if (width < 1280) return 8;
    return 10;
  }

  // Matches tailwind grid breakpoints: 1 col (<640), 2 cols (sm), 3 cols (lg), 4 cols (xl), 5 cols (2xl)
  // Always a clean multiple of column count so rows remain full and balanced.
  if (width < 640) return 6;
  if (width < 1024) return 8;
  if (width < 1280) return 9;
  if (width < 1536) return 12;
  return 15;
}

export function useAdaptivePageSize(viewMode: 'grid' | 'list'): number {
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window === 'undefined') return viewMode === 'grid' ? 12 : 10;
    return computeAdaptivePageSize(window.innerWidth, viewMode);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId = 0;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const next = computeAdaptivePageSize(window.innerWidth, viewMode);
        setPageSize((prev) => (prev === next ? prev : next));
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode]);

  return pageSize;
}
