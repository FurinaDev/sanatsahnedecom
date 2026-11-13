import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  position?: 'top' | 'bottom';
  className?: string;
}

function buildPageTokens(currentPage: number, totalPages: number): (number | 'ellipsis-left' | 'ellipsis-right')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: (number | 'ellipsis-left' | 'ellipsis-right')[] = [1];

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) tokens.push('ellipsis-left');
  for (let p = left; p <= right; p += 1) {
    tokens.push(p);
  }
  if (right < totalPages - 1) tokens.push('ellipsis-right');

  tokens.push(totalPages);
  return tokens;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'kayıt',
  position = 'top',
  className = '',
}) => {
  if (totalItems === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalItems);
  const tokens = buildPageTokens(safePage, totalPages);

  return (
    <nav
      aria-label={position === 'top' ? 'Üst sayfa gezinmesi' : 'Alt sayfa gezinmesi'}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] text-xs ${className}`}
    >
      <div className="text-[#475569] dark:text-slate-300 tabular-nums text-center sm:text-left">
        Toplam <strong className="font-bold text-[#0f172a] dark:text-white">{totalItems}</strong> {itemLabel}
        {' · '}
        <span className="text-[#64748b] dark:text-slate-400">
          {startIdx}–{endIdx} arası gösteriliyor (Sayfa {safePage} / {totalPages})
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="Önceki sayfa"
            className="inline-flex items-center justify-center gap-1 h-10 sm:h-9 px-2.5 sm:px-3 rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-slate-200 font-semibold transition-colors hover:border-[#f25922] hover:text-[#f25922] disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">Önceki</span>
          </button>

          <div className="flex items-center gap-1 tabular-nums">
            {tokens.map((token) =>
              typeof token === 'number' ? (
                <button
                  key={token}
                  type="button"
                  onClick={() => onPageChange(token)}
                  aria-label={`Sayfa ${token}`}
                  aria-current={token === safePage ? 'page' : undefined}
                  className={`inline-flex items-center justify-center h-10 sm:h-9 min-w-10 sm:min-w-9 px-2.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    token === safePage
                      ? 'bg-[#16274e] dark:bg-[#f25922] text-white border border-[#16274e] dark:border-[#f25922]'
                      : 'bg-white dark:bg-[#0f1c38] text-[#475569] dark:text-slate-300 border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922] hover:text-[#f25922]'
                  }`}
                >
                  {token}
                </button>
              ) : (
                <span
                  key={token}
                  aria-hidden="true"
                  className="px-1.5 text-[#64748b] dark:text-slate-400 select-none font-bold"
                >
                  …
                </span>
              )
            )}
          </div>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="Sonraki sayfa"
            className="inline-flex items-center justify-center gap-1 h-10 sm:h-9 px-2.5 sm:px-3 rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-slate-200 font-semibold transition-colors hover:border-[#f25922] hover:text-[#f25922] disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
          >
            <span className="hidden xs:inline sm:inline">Sonraki</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}
    </nav>
  );
};
