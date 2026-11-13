import React from 'react';

interface BrandSymbolProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * Official geometric emblem extracted directly from Çağdaş Müzik Platformu
 * brand identity vector artwork (5 overlapping architectural rectangles).
 */
export const BrandSymbol: React.FC<BrandSymbolProps> = ({
  className = 'w-8 h-6 text-white',
  strokeWidth = 3.6,
}) => (
  <svg
    viewBox="0 0 100 72"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeMiterlimit={4}
    className={className}
    aria-hidden="true"
  >
    <rect x="29.41" y="5.00" width="49.97" height="24.11" />
    <rect x="51.96" y="14.13" width="42.97" height="29.59" />
    <rect x="5.07" y="24.65" width="57.35" height="21.26" />
    <rect x="79.36" y="29.37" width="15.56" height="28.70" />
    <rect x="62.58" y="36.27" width="32.34" height="30.73" />
  </svg>
);
